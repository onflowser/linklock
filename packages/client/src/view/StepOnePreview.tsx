import { Header } from "./shared/header/Header";
import { Stepper } from "./shared/stepper/Stepper";
import "./steps.scss";
import "./StepOnePreview.scss";
import { Button } from "./shared/button/Button";
import { MembershipDefinition } from "@membership/flow/index";
import { MembershipDefinitionCard } from "./shared/membership-card/MembershipDefinitionCard";

export interface StepOnePreviewProps {
  onCompleteStep: () => void;
  membershipDefinition: MembershipDefinition;
}

export function StepOnePreview({
  onCompleteStep,
  membershipDefinition,
}: StepOnePreviewProps) {
  return (
    <div className="step-container">
      <Header></Header>
      <Stepper step={2} stepTitle={"Membership Preview"}></Stepper>

      {/* MEMBERSHIP CONTENT */}
      <div className={"membership-box-wrapper"}>
        <div className={"inner-wrapper"}>
          <MembershipDefinitionCard
            membershipDefinition={membershipDefinition}
          />
        </div>
      </div>

      {/* WALLET CONTENT */}
      <div className={"wallet-wrapper"}>
        <span>Wallet: 0X123B…C45d</span>
        <span>Disconnect</span>
      </div>

      {/* NAVIGATION CONTENT */}
      <div className={"button-wrapper"}>
        <Button onClick={onCompleteStep}>REDEEM</Button>
      </div>
    </div>
  );
}
