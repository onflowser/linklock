import { CenterModal } from "./view/shared/Modal";
import { useEffect, useState } from "react";
import { useFlow } from "./providers/flow.provider";
import {
  useGetMembershipInstances,
  useGetMembershipDefinitionsByAdmin,
} from "./hooks/cache";
import "./styles/reset.scss";
import { StepOnePreview } from "./view/StepOnePreview";
import { StepTwoRequirement } from "./view/StepTwoRequirement";
import { StepThreeClaimed } from "./view/StepThreeClaimed";
import { CheckoutStep } from "./utils";

export type MembershipCheckoutProps = {
  adminAddress: string;
  membershipDefinitionId: number;
  isOpenModal: boolean;
  onCloseModal: () => void;
  setIsOpenModal: (state: boolean) => void;
};

export function MembershipCheckout({
  adminAddress,
  membershipDefinitionId,
  isOpenModal,
  setIsOpenModal,
  onCloseModal,
}: MembershipCheckoutProps) {
  const { currentUser } = useFlow();
  const { data: membershipDefinitions, error: membershipDefinitionError } =
    useGetMembershipDefinitionsByAdmin(adminAddress);
  // TODO: Handle errors
  const {
    data: ownedMembershipInstances,
    error: membershipInstancesError,
    mutate: refetchMembershipInstances,
  } = useGetMembershipInstances(currentUser?.address);
  const membershipDefinition = membershipDefinitions?.find(
    (definition) => definition.id === String(membershipDefinitionId)
  );
  const membershipInstance = ownedMembershipInstances?.find(
    (membership) =>
      membership.adminAddress === adminAddress &&
      membershipDefinition &&
      membership.id === membershipDefinition.id
  );
  const [checkoutStep, setCheckoutStep] = useState(CheckoutStep.PREVIEW);

  useEffect(() => {
    if (membershipInstance) {
      setCheckoutStep(CheckoutStep.CLAIMED);
    } else {
      setCheckoutStep(CheckoutStep.PREVIEW);
    }
  }, [isOpenModal, membershipInstance]);

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
            membershipInstance={membershipInstance}
            membershipDefinition={membershipDefinition}
            onCompleteStep={() => setCheckoutStep(CheckoutStep.REQUIREMENT)}
          />
        );
      case CheckoutStep.REQUIREMENT:
        return (
          <StepTwoRequirement
            adminAddress={adminAddress}
            membershipInstance={membershipInstance}
            membershipDefinition={membershipDefinition}
            onCompleteStep={() => setCheckoutStep(CheckoutStep.CLAIMED)}
          />
        );
      case CheckoutStep.CLAIMED:
        return membershipInstance ? (
          <StepThreeClaimed
            onMoveToStep={setCheckoutStep}
            setIsOpenModal={setIsOpenModal}
            onCloseModal={() => onCloseModal()}
            membershipInstance={membershipInstance}
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