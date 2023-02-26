import { BaseMembershipCard } from "./base/BaseMembershipCard";
import { MembershipNFT } from "@membership/flow/index";
import { getMembershipStatus } from "../../../utils";

export type MembershipCardProps = {
  membership: MembershipNFT;
};

export function MembershipCard({ membership }: MembershipCardProps) {
  return (
    <BaseMembershipCard
      name={membership.name}
      thumbnailImageUrl={membership.thumbnail}
      description={membership.description}
      status={getMembershipStatus(membership)}
    />
  );
}
