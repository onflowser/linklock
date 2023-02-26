import { Header } from "./shared/header/Header";
import { Stepper } from "./shared/stepper/Stepper";
import "./steps.scss";
import "./StepOnePreview.scss";
import { Button } from "./shared/button/Button";
import { MembershipDefinition, MembershipNFT } from "@membership/flow/index";
import { MembershipDefinitionCard } from "./shared/membership-card/MembershipDefinitionCard";

import { useFlow } from "@membership/client";

export interface StepOnePreviewProps {
  onCompleteStep: () => void;
  membershipDefinition: MembershipDefinition;
  ownedTargetMembership?: MembershipNFT;
}

export function StepOnePreview({
  onCompleteStep,
  membershipDefinition,
  ownedTargetMembership,
}: StepOnePreviewProps) {
  const { currentUser, logout } = useFlow();
  const isMembershipActive = (
    membership: MembershipNFT | undefined
  ): boolean => {
    if (membership === undefined) {
      return false;
    } else {
      // TODO: Implement - if expired return true
      return true;
    }
  };

  return (
    <div className="step-container">
      <Header></Header>
      <Stepper step={1} stepTitle={"Membership Preview"}></Stepper>

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
          <span>Wallet: {currentUser!.address}</span>
          <a href={"#"} onClick={logout}>
            Disconnect
          </a>
        </div>
      )}

      {/* NAVIGATION CONTENT */}
      <div className={"button-wrapper"}>
        <Button
          onClick={onCompleteStep}
          disabled={isMembershipActive(ownedTargetMembership)}
        >
          REDEEM
        </Button>
      </div>
    </div>
  );
}
