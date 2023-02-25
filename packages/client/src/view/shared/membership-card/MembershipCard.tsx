import { BaseMembershipCard } from "./base/BaseMembershipCard";
import { MembershipNFT } from "@membership/flow/index";

export type MembershipCardProps = {
  membership: MembershipNFT;
};

export function MembershipCard(props: MembershipCardProps) {
  // TODO: Adapt this component
  return (
    <BaseMembershipCard
      coins={"1 FLOW"}
      name={"Jane Doe"}
      thumb={
        "https://www.visme.co/wp-content/uploads/2021/06/Thumbnail-maker-share.jpg"
      }
      membershipName={"Membership name"}
      duration={"1 Month"}
      usd={"12.99 USD"}
    ></BaseMembershipCard>
  );
}
