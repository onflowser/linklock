import { CenterModal } from "./core/Modal";
import { useState } from "react";
import { useFlow } from "./providers/flow.provider";
import { useGetMembershipDefinition } from "./hooks/cache";

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
  const { data: membershipDefinition } =
    useGetMembershipDefinition("0xf8d6e0586b0a20c7");
  const [checkoutStep, setCheckoutStep] = useState(CheckoutStep.PREVIEW);

  function renderStep() {
    switch (checkoutStep) {
      case CheckoutStep.PREVIEW:
        return <pre>{JSON.stringify(membershipDefinition, null, 4)}</pre>;
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
