import { CenterModal } from "./core/Modal";
import { useState } from "react";
import { useFlow } from "./providers/flow.provider";
import { useGetMembership, useGetMembershipDefinition } from "./hooks/cache";
import { FlowService } from "./services/flow.service";

export type MembershipCheckoutProps = {};

enum CheckoutStep {
  PREVIEW,
  REQUIREMENT,
  CLAIMED,
}

const testAdminAddress = "0xf8d6e0586b0a20c7";

const flowService = FlowService.create();

export function MembershipCheckout({
  ...centerModalProps
}: MembershipCheckoutProps) {
  const { currentUser } = useFlow();
  const { data: membershipDefinition } =
    useGetMembershipDefinition(testAdminAddress);
  const { data: membership } = useGetMembership(currentUser?.address);
  const [checkoutStep, setCheckoutStep] = useState(CheckoutStep.PREVIEW);

  console.log(currentUser?.address, membership);

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
        return (
          <button
            onClick={() =>
              flowService
                .claimMembership(testAdminAddress)
                .then(() => setCheckoutStep(CheckoutStep.CLAIMED))
                .catch(console.error)
            }
          >
            Claim
          </button>
        );
      case CheckoutStep.CLAIMED:
        return <pre>{JSON.stringify(membership, null, 4)}</pre>;

      default:
        return <></>;
    }
  }

  return (
    <CenterModal isOpen={true} {...centerModalProps}>
      {renderStep()}
    </CenterModal>
  );
}
