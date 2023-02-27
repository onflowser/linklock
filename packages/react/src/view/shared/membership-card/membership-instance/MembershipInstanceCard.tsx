import { BaseMembershipCard } from "../base/BaseMembershipCard";
import { MembershipInstance } from "@membership/protocol";
import { getMembershipStatus, unixTimestampToDate } from "../../../../utils";
import { StopWatch } from "../../icons/StopWatch";
import { SizedBox } from "../../SizedBox";
import './MembershipInstanceCard.scss';

export type MembershipInstanceCardProps = {
  membership: MembershipInstance;
};

export function MembershipInstanceCard({
  membership,
}: MembershipInstanceCardProps) {
  return (
    <BaseMembershipCard
      name={membership.name}
      thumbnailImageUrl={membership.thumbnail}
      description={membership.description}
      status={getMembershipStatus(membership)}
      footer={
        <div className={"bottom"}>
          <span>
            <StopWatch />
            <SizedBox inline width={5} />
            Expiration:{" "}
            {unixTimestampToDate(
              +membership.validUntilTimestamp
            )?.toDateString()}
          </span>
        </div>
      }
    />
  );
}
