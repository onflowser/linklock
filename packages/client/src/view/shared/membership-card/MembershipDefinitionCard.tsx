import { MembershipDefinition, MembershipNFT } from "@membership/flow/index";
import {
  BaseMembershipCard,
} from "./base/BaseMembershipCard";
// @ts-ignore
import prettyMilliseconds from "pretty-ms";
import { useFlowPrice, formatFlowCoins } from "../../../hooks/coin-price";
import { getMembershipStatus } from "../../../utils";

export type MembershipDefinitionCardProps = {
  membershipDefinition: MembershipDefinition;
  ownedTargetMembership?: MembershipNFT;
};

export function MembershipDefinitionCard({
  membershipDefinition,
  ownedTargetMembership,
}: MembershipDefinitionCardProps) {
  const { name, thumbnail, expirationInterval, requirement, description } =
    membershipDefinition;

  const { data: flowPrice } = useFlowPrice();

  return (
    <BaseMembershipCard
      coins={`${formatFlowCoins(requirement.price)} FLOW`}
      name={name}
      thumb={thumbnail}
      membershipName={description}
      duration={prettyMilliseconds(+expirationInterval * 1000)}
      usd={`${+flowPrice?.usd * +requirement.price} USD`}
      status={getMembershipStatus(ownedTargetMembership)}
    />
  );
}
