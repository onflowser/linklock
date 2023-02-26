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
