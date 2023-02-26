import { MembershipNFT } from "@membership/flow/index";

export type AppEnvironment = "production" | "staging" | "development";

export type AppConfig = {
  environment: AppEnvironment;
};

export function getConfig(): AppConfig {
  return {
    environment: "development",
  };
}

const secondsInDay = 24 * 60 * 60;

export function secondsToDays(seconds: number) {
  return seconds / secondsInDay;
}

export function daysToSeconds(days: number) {
  return days * secondsInDay;
}

export enum MembershipStatus {
  UNKNOWN = "unknown",
  VALID = "valid",
  EXPIRED = "expired",
}

export const getMembershipStatus = (
  membership: MembershipNFT | undefined
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
