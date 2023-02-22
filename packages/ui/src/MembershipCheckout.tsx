import { CenterModal } from "./core/Modal";
import { useState } from "react";
import { useFlow } from "./providers/flow.provider";

export type MembershipCheckoutProps = {};

enum CheckoutStep {
  PREVIEW,
  REQUIREMENT,
  CLAIMED,
}

export function MembershipCheckout({
  ...centerModalProps
}: MembershipCheckoutProps) {
  const { currentUser } = useFlow();
  const [checkoutStep, setCheckoutStep] = useState(CheckoutStep.PREVIEW);

  console.log(currentUser);

  function renderStep() {
    switch (checkoutStep) {
      case CheckoutStep.PREVIEW:
        return (
          <div>
            {currentUser?.address}
            <br />
            {currentUser?.flowBalance}
          </div>
        );
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
