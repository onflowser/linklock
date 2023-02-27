import { Stepper } from "./shared/stepper/Stepper";
import "./steps.scss";
import "./StepOnePreview.scss";
import {
  MembershipDefinition,
  MembershipInstance,
} from "@membership/flow/index";
import { MembershipDefinitionCard } from "./shared/membership-card/membership-definition/MembershipDefinitionCard";

import { Button } from "./shared/button/Button";
import { Header } from "./shared/header/Header";
import { useFlow } from "../providers/flow.provider";
import { getMembershipStatus, MembershipStatus } from "../utils";

export interface StepOnePreviewProps {
  onCompleteStep: () => void;
  membershipDefinition: MembershipDefinition;
  membershipInstance: MembershipInstance | undefined;
}

export function StepOnePreview({
  onCompleteStep,
  membershipDefinition,
  membershipInstance,
}: StepOnePreviewProps) {
  const { currentUser, logout } = useFlow();
  const membershipStatus = getMembershipStatus(membershipInstance);

  return (
    <div className="step-container">
      <Header />
      {membershipStatus !== MembershipStatus.VALID && (
        <Stepper step={1} stepTitle={"Membership Preview"}></Stepper>
      )}

      {/* MEMBERSHIP CONTENT */}
      <div className={"membership-box-wrapper"}>
        <div className={"inner-wrapper"}>
          <MembershipDefinitionCard
            membershipDefinition={membershipDefinition}
          />
        </div>
      </div>

      {/* WALLET CONTENT */}
      {currentUser && (
        <div className={"wallet-wrapper"}>
          <span>Wallet: {currentUser.address ?? "-"}</span>
          <a href={"#"} onClick={logout}>
            Disconnect
          </a>
        </div>
      )}

      {/* NAVIGATION CONTENT */}
      {membershipStatus !== MembershipStatus.VALID && (
        <div className={"button-wrapper"}>
          <Button onClick={onCompleteStep}>
            {getButtonTitle(membershipStatus)}
          </Button>
        </div>
      )}
    </div>
  );
}

function getButtonTitle(membershipStatus: MembershipStatus) {
  switch (membershipStatus) {
    case MembershipStatus.EXPIRED:
      return "REDEEM";
    case MembershipStatus.UNKNOWN:
      return "NEXT";
  }
}
