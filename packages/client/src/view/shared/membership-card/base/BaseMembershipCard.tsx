import "./BaseMembershipCard.scss";
import { MembershipStatus } from "../../../../utils";
// @ts-ignore missing type declarations
import DefaultThumb from "../../../assets/default-thumbnail.png";
import { ReactNode } from "react";

export interface MembershipBoxProps {
  name: string;
  className?: string;
  description: string;
  thumbnailImageUrl: string;
  footer?: ReactNode;
  status?: MembershipStatus;
}

export function BaseMembershipCard({
  name,
  description,
  thumbnailImageUrl,
  className,
  footer,
  status = MembershipStatus.UNKNOWN,
}: MembershipBoxProps) {
  return (
    // TODO: use classnames library for concatenating classes
    <div className={"membership-box-container" + " " + className}>
      {status !== MembershipStatus.UNKNOWN && (
        <span className={`badge ${status}`}>{status}</span>
      )}
      <div className={"top"}>
        <img src={thumbnailImageUrl || DefaultThumb.src} alt={name} />
        <div>
          <span>{name}</span>
          <span>{description}</span>
          {/* TODO: Should we display a link here? */}
          {/*<a href="packages/client/src/view/shared/membership-card/base-membership-card#somewhere">*/}
          {/*  view contract*/}
          {/*  <ExternalLink></ExternalLink>*/}
          {/*</a>*/}
        </div>
      </div>
      {footer}
    </div>
  );
}
