import { Stepper } from "./shared/stepper/Stepper";
import "./steps.scss";
import "./StepOnePreview.scss";
import {
  MembershipDefinition,
  MembershipInstance,
} from "@membership/flow/index";
import { MembershipDefinitionCard } from "./shared/membership-card/membership-definition/MembershipDefinitionCard";

import {
  getMembershipStatus,
  MembershipStatus,
  useFlow,
} from "@membership/client";
import { Button } from "./shared/button/Button";
import { Header } from "./shared/header/Header";

export interface StepOnePreviewProps {
  onCompleteStep: () => void;
  membershipDefinition: MembershipDefinition;
  ownedTargetMembership?: MembershipInstance;
}

export function StepOnePreview({
  onCompleteStep,
  membershipDefinition,
  ownedTargetMembership,
}: StepOnePreviewProps) {
  const { currentUser, logout } = useFlow();
  const membershipStatus = getMembershipStatus(ownedTargetMembership);

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
            ownedTargetMembership={ownedTargetMembership}
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
      return "Redeem";
    case MembershipStatus.UNKNOWN:
      return "Next";
  }
}
