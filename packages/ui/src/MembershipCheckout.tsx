import { CenterModal } from "./core/Modal";
import { useState } from "react";
import { transactions } from "@membership/flow";

export type MembershipCheckoutProps = {};

enum CheckoutStep {
  PREVIEW,
  REQUIREMENT,
  CLAIMED,
}

export function MembershipCheckout({
  ...centerModalProps
}: MembershipCheckoutProps) {
  const [checkoutStep, setCheckoutStep] = useState(CheckoutStep.PREVIEW);

  console.log(transactions.claimMembership);

  function renderStep() {
    switch (checkoutStep) {
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
