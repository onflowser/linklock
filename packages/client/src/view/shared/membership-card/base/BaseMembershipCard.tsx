import "./BaseMembershipCard.scss";
import { ExternalLink } from "../../icons/ExternalLink";
import { StopWatch } from "../../icons/StopWatch";
import { MembershipStatus } from "../../../../utils";

export interface MembershipBoxProps {
  name: string;
  membershipName: string;
  thumb: string;
  duration: string | any;
  coins: number | string;
  usd: number | string;
  status?: MembershipStatus;
}

export function BaseMembershipCard({
  name,
  membershipName,
  thumb,
  duration,
  coins,
  usd,
  status = MembershipStatus.UNKNOWN,
}: MembershipBoxProps) {
  return (
    <div className={"membership-box-container"}>
      {status !== MembershipStatus.UNKNOWN && (
        <span className={`badge ${status}`}>{status}</span>
      )}
      <div className={"top"}>
        <img src={thumb} alt={name} />
        <div>
          <span>{name}</span>
          <span>{membershipName}</span>
          <a href="packages/client/src/view/shared/membership-card/base-membership-card#somewhere">
            view contract
            <ExternalLink></ExternalLink>
          </a>
        </div>
      </div>
      <div className={"bottom"}>
        <span>
          <StopWatch></StopWatch>
          membership duration: {duration}
        </span>
        <div>
          <span>{coins}</span>
          <span>={usd}</span>
        </div>
      </div>
    </div>
  );
}
