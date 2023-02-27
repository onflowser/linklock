import { MembershipDefinition } from "@membership/protocol";
import { BaseMembershipCard } from "../base/BaseMembershipCard";
import "./MembershipDefinitionCard.scss";
// @ts-ignore
import prettyMilliseconds from "pretty-ms";
import { formatFlowCoins, useFlowToUsd } from "../../../../hooks/coin-price";
import { StopWatch } from "../../icons/StopWatch";

export type MembershipDefinitionCardProps = {
  className?: string;
  membershipDefinition: MembershipDefinition;
};

export function MembershipDefinitionCard({
  className,
  membershipDefinition,
}: MembershipDefinitionCardProps) {
  const { name, thumbnail, expirationInterval, requirement, description } =
    membershipDefinition;

  const usdPrice = useFlowToUsd(+requirement.price);
  return (
    <BaseMembershipCard
      className={"membership-definition-card" + " " + className}
      name={name}
      thumbnailImageUrl={thumbnail}
      description={description}
      footer={
        <div className={"bottom"}>
          <span>
            <StopWatch />
            Membership duration:{" "}
            {prettyMilliseconds(+expirationInterval * 1000)}
          </span>
          <div>
            <span>{`${formatFlowCoins(requirement.price)} FLOW`}</span>
            <span>{usdPrice ? `~${usdPrice} USD` : "-"}</span>
          </div>
        </div>
      }
    />
  );
}
