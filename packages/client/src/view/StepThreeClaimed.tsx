import { Header } from "./shared/header/Header";
import { Stepper } from "./shared/stepper/Stepper";
import { Button } from "./shared/button/Button";
import "./StepThreeClaimed.scss";
import { MembershipNFT } from "@membership/flow/index";
import { MembershipCard } from "./shared/membership-card/MembershipCard";

export interface StepThreeClaimedProps {
  onCompleteStep: () => void;
  membership: MembershipNFT;
}

export function StepThreeClaimed({
  onCompleteStep,
  membership,
}: StepThreeClaimedProps) {
  return (
    <div className="step-container">
      <Header></Header>
      <Stepper step={3} stepTitle={"Your membership-card"}></Stepper>

      <div className="wrapper">
        <MembershipCard membership={membership} />

        <Button onClick={onCompleteStep}>DONE</Button>
      </div>
    </div>
  );
}
