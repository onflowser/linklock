import { CenterModal } from "./core/Modal";
import { useEffect, useState } from "react";
import { useFlow } from "./providers/flow.provider";
import { useGetMembership, useGetMembershipDefinition } from "./hooks/cache";
import { FlowService } from "./services/flow.service";

export type MembershipCheckoutProps = {
  communityAddress: string;
  isOpenModal: boolean;
  onCloseModal: () => void;
};

enum CheckoutStep {
  PREVIEW,
  REQUIREMENT,
  CLAIMED,
}

const flowService = FlowService.create();

export function MembershipCheckout({
  communityAddress,
  isOpenModal,
    onCloseModal
}: MembershipCheckoutProps) {
  const { currentUser } = useFlow();
  const { data: membershipDefinition, error: membershipDefinitionError } =
    useGetMembershipDefinition(communityAddress);
  const { data: membership, error: membershipError } = useGetMembership(
    currentUser?.address
  );
  const [checkoutStep, setCheckoutStep] = useState(CheckoutStep.PREVIEW);

  useEffect(() => {
    if (membership) {
      setCheckoutStep(CheckoutStep.CLAIMED);
    }
  }, [membership]);

  function onClaimRequirement() {
    flowService
      .setupAccount()
      .then(() => {
        flowService
          .sendClaimMembershipTransaction({
            adminAddress: communityAddress,
            paymentAmount: membershipDefinition!.requirement.price,
            // TODO: Dynamically retrieve fungible token type or storage path
            fungibleTokenStoragePath: "flowTokenVault",
          })
          .then(() => setCheckoutStep(CheckoutStep.CLAIMED))
          .catch(console.error);
      })
      .catch(console.error);
  }

  function renderStep() {
    switch (checkoutStep) {
      case CheckoutStep.PREVIEW:
        return (
          <div>
            <pre>{JSON.stringify(membershipDefinition, null, 4)}</pre>
            <button onClick={() => setCheckoutStep(CheckoutStep.REQUIREMENT)}>
              Next
            </button>
          </div>
        );
      case CheckoutStep.REQUIREMENT:
        return <button onClick={onClaimRequirement}>Claim</button>;
      case CheckoutStep.CLAIMED:
        return <pre>{JSON.stringify(membership, null, 4)}</pre>;

      default:
        return <></>;
    }
  }

  function renderModalContent() {
    if (membershipDefinitionError) {
      return `Error loading membership definition: ${JSON.stringify(
        membershipDefinitionError
      )}`;
    }
    if (!membershipDefinition) {
      return "Loading...";
    }
    return renderStep();
  }

  function onRequestClose() {
    onCloseModal()
  }

  return <CenterModal isOpen={isOpenModal} onRequestClose={onRequestClose}>{renderModalContent()}</CenterModal>;
}
