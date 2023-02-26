import { Header } from "./shared/header/Header";
import { Stepper } from "./shared/stepper/Stepper";
import { Button } from "./shared/button/Button";
import "./StepThreeClaimed.scss";
import { MembershipInstance } from "@membership/flow/index";
import { MembershipInstanceCard } from "./shared/membership-card/membership-instance/MembershipInstanceCard";

export interface StepThreeClaimedProps {
  onCompleteStep: () => void;
  membership: MembershipInstance;
}

export function StepThreeClaimed({
  onCompleteStep,
  membership,
}: StepThreeClaimedProps) {
  return (
    <div className="step-container">
      <Header></Header>
      <Stepper step={3} stepTitle={"Your membership"}></Stepper>

      <div className="wrapper">
        <MembershipInstanceCard membership={membership} />

        <Button onClick={onCompleteStep}>DONE</Button>
      </div>
    </div>
  );
}
