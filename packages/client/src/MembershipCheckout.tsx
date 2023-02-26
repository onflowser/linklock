import { CenterModal } from "./view/shared/Modal";
import { useEffect, useState } from "react";
import { useFlow } from "./providers/flow.provider";
import {
  useGetMemberships,
  useGetMembershipDefinitionsByAdmin,
} from "./hooks/cache";
import { FlowService } from "./services/flow.service";
import "./index.scss";
import { StepOnePreview } from "./view/StepOnePreview";
import { StepTwoRequirement } from "./view/StepTwoRequirement";
import { StepThreeClaimed } from "./view/StepThreeClaimed";

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
  const { data: membershipDefinitions, error: membershipDefinitionError } =
    useGetMembershipDefinitionsByAdmin(adminAddress);
  // TODO: Handle errors
  const {
    data: ownedMemberships,
    error: membershipError,
    mutate: refetchMemberships,
  } = useGetMemberships(currentUser?.address);
  const membershipDefinition = membershipDefinitions?.find(
    (definition) => definition.id === String(membershipDefinitionId)
  );
  const ownedTargetMembership = ownedMemberships?.find(
    (membership) =>
      membership.adminAddress === adminAddress &&
      membershipDefinition &&
      membership.id === membershipDefinition!.id
  );
  const [checkoutStep, setCheckoutStep] = useState(CheckoutStep.PREVIEW);

  useEffect(() => {
    if (
      ownedTargetMembership &&
      ownedTargetMembership.id === membershipDefinition!.id
    ) {
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

  function onDone() {
    onCloseModal();
  }

  function renderStep() {
    if (membershipDefinitionError) {
      return `Error loading membership definition: ${JSON.stringify(
        membershipDefinitionError
      )}`;
    }
    if (!membershipDefinition) {
      return "No membership-card definition";
    }
    switch (checkoutStep) {
      case CheckoutStep.PREVIEW:
        return (
          <StepOnePreview
            ownedTargetMembership={ownedTargetMembership}
            membershipDefinition={membershipDefinition}
            onCompleteStep={() => setCheckoutStep(CheckoutStep.REQUIREMENT)}
          />
        );
      case CheckoutStep.REQUIREMENT:
        return (
          <StepTwoRequirement
            membershipDefinition={membershipDefinition}
            onCompleteStep={onClaimRequirement}
          />
        );
      case CheckoutStep.CLAIMED:
        return ownedTargetMembership ? (
          <StepThreeClaimed
            onCompleteStep={onDone}
            membership={ownedTargetMembership}
          />
        ) : (
          "Loading..."
        );

      default:
        return <></>;
    }
  }

  function onRequestClose() {
    onCloseModal();
  }

  return (
    <CenterModal
      isOpen={isOpenModal}
      onRequestClose={onRequestClose}
      maxWidth={"525px"}
    >
      {renderStep()}
    </CenterModal>
  );
}
