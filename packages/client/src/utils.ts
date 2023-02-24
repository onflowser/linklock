export type AppEnvironment = "production" | "staging" | "development";

export type AppConfig = {
    environment: AppEnvironment;
}

export function getConfig(): AppConfig {
    return {
        environment: "development"
    }
}
