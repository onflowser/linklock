import { Header } from "./shared/header/Header";
import { Stepper } from "./shared/stepper/Stepper";
import { Button } from "./shared/button/Button";
import "./StepThreeClaimed.scss";
import { MembershipInstance } from "@membership/protocol";
import { MembershipInstanceCard } from "./shared/membership-card/membership-instance/MembershipInstanceCard";
import { CheckoutStep, getMembershipStatus, MembershipStatus } from "../utils";
import { AccountOwnershipProof, useFlow } from "../providers/flow.provider";
import { ServiceRegistry } from "../services/service-registry";
import toast from "react-hot-toast";
import { TransactionResult } from "@membership/client";

export type AuthorizationProps = {
  // Request user to provide a proof of membership (account signature)
  requestAuthorization?: boolean;
  onAuthorizationComplete?: (proof: AccountOwnershipProof) => void;
};

export type StepThreeClaimedProps = AuthorizationProps & {
  onMoveToStep: (step: CheckoutStep) => void;
  onRequestClose: () => void;
  membershipInstance: MembershipInstance;
};

export function StepThreeClaimed({
  onMoveToStep,
  onRequestClose,
  membershipInstance,
  requestAuthorization,
  onAuthorizationComplete,
}: StepThreeClaimedProps) {
  const membershipStatus = getMembershipStatus(membershipInstance);
  const { login, getAccountOwnershipProof } = useFlow();

  const onLastStep = () => {
    if (requestAuthorization) {
      onAuthenticate();
    } else {
      onMoveToStep(CheckoutStep.CLAIMED);
      onRequestClose();
    }
  };

  async function onAuthenticate() {
    await login();
    const proof = await toast.promise(getAccountOwnershipProof(), {
      error: (result: TransactionResult) =>
        `Failed to prove membership: ${result.error?.message}`,
      loading: "Getting proof of membership...",
      success: "Membership proved!",
    });
    onAuthorizationComplete?.(proof);
  }

  return (
    <div className="step-container">
      <Header></Header>
      <Stepper step={3} stepTitle={"Your membership"}></Stepper>

      <div className="wrapper">
        <MembershipInstanceCard membership={membershipInstance} />

        <Button onClick={onLastStep}>
          {getButtonTitle({ membershipStatus, requestAuthorization })}
        </Button>
      </div>
    </div>
  );
}

function getButtonTitle(props: {
  membershipStatus: MembershipStatus;
  requestAuthorization?: boolean;
}) {
  if (props.requestAuthorization) {
    return "AUTHORIZE";
  }
  switch (props.membershipStatus) {
    case MembershipStatus.EXPIRED:
      return "REDEEM";
    case MembershipStatus.VALID:
      return "DONE";
  }
}
