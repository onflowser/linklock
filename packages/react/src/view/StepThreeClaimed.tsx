import { Header } from "./shared/header/Header";
import { Stepper } from "./shared/stepper/Stepper";
import { Button } from "./shared/button/Button";
import "./StepThreeClaimed.scss";
import { MembershipInstance } from "@membership/protocol";
import { MembershipInstanceCard } from "./shared/membership-card/membership-instance/MembershipInstanceCard";
import { CheckoutStep, getMembershipStatus, MembershipStatus } from "../utils";

export interface StepThreeClaimedProps {
  onMoveToStep: (step: CheckoutStep) => void;
  onRequestClose: () => void;
  membershipInstance: MembershipInstance;
}

export function StepThreeClaimed({
  onMoveToStep,
  onRequestClose,
  membershipInstance,
}: StepThreeClaimedProps) {
  const membershipStatus = getMembershipStatus(membershipInstance);

  const onLastStep = () => {
    onMoveToStep(CheckoutStep.CLAIMED);
    onRequestClose()
  }

  return (
    <div className="step-container">
      <Header></Header>
      <Stepper step={3} stepTitle={"Your membership"}></Stepper>

      <div className="wrapper">
        <MembershipInstanceCard membership={membershipInstance} />

        <Button onClick={onLastStep}>
          {getButtonTitle(membershipStatus)}
        </Button>
      </div>
    </div>
  );
}

function getButtonTitle(membershipStatus: MembershipStatus) {
  switch (membershipStatus) {
    case MembershipStatus.EXPIRED:
      return "REDEEM";
    case MembershipStatus.VALID:
      return "DONE";
  }
}
