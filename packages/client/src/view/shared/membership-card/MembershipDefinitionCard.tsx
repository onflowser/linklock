import { MembershipDefinition, MembershipNFT } from "@membership/flow/index";
import { BaseMembershipCard, MembershipStatus } from "./base/BaseMembershipCard";
// @ts-ignore
import HumanizeDuration from 'react-humanize-duration';
import { useFlowPrice, formatFlowCoins } from '../../../hooks/coin-price';


export type MembershipDefinitionCardProps = {
  membershipDefinition: MembershipDefinition;
  ownedTargetMembership?: MembershipNFT;
};

export function MembershipDefinitionCard({
  membershipDefinition,
  ownedTargetMembership
}: MembershipDefinitionCardProps) {
  const { name, thumbnail, expirationInterval, requirement, description } =
    membershipDefinition;

  const {data: flowPrice } = useFlowPrice();

  const getMembershipStatus = (membership: MembershipNFT | undefined): MembershipStatus => {
    if (membership === undefined) {
      return MembershipStatus.UNKNOWN;
    } else {
      // TODO: Implement
      return MembershipStatus.VALID;
    }
  }


  return (
    <BaseMembershipCard
      coins={`${formatFlowCoins(requirement.price)} FLOW`}
      name={name}
      thumb={thumbnail}
      membershipName={description}
      duration={<HumanizeDuration duration={expirationInterval}/>}
      usd={`${flowPrice.usd} USD`}
      status={getMembershipStatus(ownedTargetMembership)}
    />
  );
}
