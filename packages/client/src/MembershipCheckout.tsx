import { CenterModal } from "./core/Modal";
import { useEffect, useState } from "react";
import { useFlow } from "./providers/flow.provider";
import {
  useGetMemberships,
  useGetMembershipDefinitionsByAdmin,
  useFlowBalance,
} from "./hooks/cache";
import { FlowService } from "./services/flow.service";

export type MembershipCheckoutProps = {
  adminAddress: string;
  membershipDefinitionId: number;
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
  adminAddress,
  membershipDefinitionId,
  isOpenModal,
  onCloseModal,
}: MembershipCheckoutProps) {
  const { currentUser } = useFlow();
  const { data: flowBalance } = useFlowBalance(currentUser?.address);
  const { data: membershipDefinitions, error: membershipDefinitionError } =
    useGetMembershipDefinitionsByAdmin(adminAddress);
  // TODO: Handle transaction errors
  const {
    data: ownedMemberships,
    error: membershipError,
    mutate: refetchMemberships,
  } = useGetMemberships(currentUser?.address);
  const membershipDefinition = membershipDefinitions?.find(
    (definition) => definition.id === String(membershipDefinitionId)
  );
  const ownedTargetMembership = ownedMemberships?.find(
    (membership) => membership.adminAddress === adminAddress
  );
  const [checkoutStep, setCheckoutStep] = useState(CheckoutStep.PREVIEW);

  useEffect(() => {
    if (ownedTargetMembership) {
      setCheckoutStep(CheckoutStep.CLAIMED);
    }
  }, [ownedMemberships]);

  function onClaimRequirement() {
    flowService
      .setupMembershipCollection()
      .then(() => {
        flowService
          .claimMembership({
            adminAddress: adminAddress,
            membershipDefinitionId,
            paymentAmount: membershipDefinition!.requirement.price,
            // TODO: Dynamically retrieve fungible token type or storage path
            fungibleTokenStoragePath: "flowTokenVault",
          })
          .then(() => {
            refetchMemberships();
            setCheckoutStep(CheckoutStep.CLAIMED);
          })
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
        const hasSufficientBalance =
          flowBalance &&
          membershipDefinition &&
          flowBalance >= Number(membershipDefinition.requirement.price);
        return (
          <div>
            <p>Flow balance: {flowBalance}</p>
            <p>
              {hasSufficientBalance
                ? "Sufficient balance"
                : "Insufficient balance"}
            </p>
            <button onClick={onClaimRequirement}>Claim</button>
          </div>
        );
      case CheckoutStep.CLAIMED:
        return <pre>{JSON.stringify(ownedTargetMembership, null, 4)}</pre>;

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
    onCloseModal();
  }

  return (
    <CenterModal isOpen={isOpenModal} onRequestClose={onRequestClose}>
      {renderModalContent()}
    </CenterModal>
  );
}
