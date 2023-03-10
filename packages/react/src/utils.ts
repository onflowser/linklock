import { MembershipInstance } from "@membership/protocol";

const secondsInDay = 24 * 60 * 60;

export function secondsToDays(seconds: number) {
  return seconds / secondsInDay;
}

export function daysToSeconds(days: number) {
  return days * secondsInDay;
}

export function unixTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export enum CheckoutStep {
  PREVIEW,
  REQUIREMENT,
  CLAIMED,
}

export enum MembershipStatus {
  UNKNOWN = "unknown",
  VALID = "valid",
  EXPIRED = "expired",
}

export const getMembershipStatus = (
  membership: MembershipInstance | undefined
): MembershipStatus => {
  if (membership === undefined) {
    return MembershipStatus.UNKNOWN;
  }

  const currentUnixTimestamp = Date.now() / 10000;
  const isValid = +membership.validUntilTimestamp > currentUnixTimestamp;

  if (isValid) {
    return MembershipStatus.VALID;
  } else {
    return MembershipStatus.EXPIRED;
  }
};
