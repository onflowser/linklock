import { MembershipDefinition } from "@membership/flow/index";
import { BaseMembershipCard } from "../base/BaseMembershipCard";
import "./MembershipDefinitionCard.scss";
// @ts-ignore
import prettyMilliseconds from "pretty-ms";
import { useFlowPrice, formatFlowCoins } from "../../../../hooks/coin-price";
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

  const { data: flowPrice } = useFlowPrice();

  return (
    <BaseMembershipCard
      className={"membership-definition-card" + " " + className}
      name={name}
      thumbnailImageUrl={thumbnail}
      description={description}
      footer={
        <div className={"bottom"}>
          <span>
            <StopWatch></StopWatch>
            membership duration:{" "}
            {prettyMilliseconds(+expirationInterval * 1000)}
          </span>
          <div>
            <span>{`${formatFlowCoins(requirement.price)} FLOW`}</span>
            <span>~{`${+flowPrice?.usd * +requirement.price} USD`}</span>
          </div>
        </div>
      }
    />
  );
}
