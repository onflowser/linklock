import { CenterModal } from "./core/Modal";
import { useEffect, useState } from "react";
import { FlowCurrentUser, FlowService } from "./services/flow.service";

export type MembershipCheckoutProps = {};

enum CheckoutStep {
  PREVIEW,
  REQUIREMENT,
  CLAIMED,
}

export function MembershipCheckout({
  ...centerModalProps
}: MembershipCheckoutProps) {
  const flowService = FlowService.create();
  // TODO: move this to provider
  const [currentUser, setCurrentUser] = useState<FlowCurrentUser>(null);
  const [checkoutStep, setCheckoutStep] = useState(CheckoutStep.PREVIEW);

  useEffect(() => {
    flowService.subscribeCurrentUser(setCurrentUser);
    flowService.authenticate().then((user) => {
      flowService.getFlowBalance(user?.addr).then(console.log);
    });
  }, []);

  console.log(currentUser);

  function renderStep() {
    switch (checkoutStep) {
      case CheckoutStep.PREVIEW:
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
