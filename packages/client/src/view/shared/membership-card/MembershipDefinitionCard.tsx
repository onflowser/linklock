import { MembershipDefinition } from "@membership/flow/index";
import { BaseMembershipCard } from "./base/BaseMembershipCard";

export type MembershipDefinitionCardProps = {
  membershipDefinition: MembershipDefinition;
};

export function MembershipDefinitionCard({
  membershipDefinition,
}: MembershipDefinitionCardProps) {
  const { name, thumbnail, expirationInterval, requirement } =
    membershipDefinition;
  return (
    <BaseMembershipCard
      coins={requirement.price}
      name={name}
      thumb={thumbnail}
      membershipName={name}
      // TODO: Format duration
      duration={expirationInterval}
      usd={requirement.price}
    />
  );
}
