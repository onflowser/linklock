import { ExternalLink } from "./shared/icons/ExternalLink";
import { Header } from "./shared/header/Header";
import { Stepper } from "./shared/stepper/Stepper";
import { Button } from "./shared/button/Button";
import "./StepThreeClaimed.scss";
import { MembershipNFT } from "@membership/flow/index";

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

      {/* TODO: Reuse membership-card box for this UI? */}
      <div className="wrapper">
        <div className={"inner-wrapper"}>
          <div className={"membership-name"}>
            <div>
              <img src={membership.thumbnail} alt={membership.name} />
            </div>
            <div>
              <span>{membership.name}</span>
              <p>{membership.description}</p>
              <a href="#somewhere">
                view NFT
                <ExternalLink></ExternalLink>
              </a>
            </div>
          </div>
        </div>

        <Button onClick={onCompleteStep}>DONE</Button>
      </div>
    </div>
  );
}
