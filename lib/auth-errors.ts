export type AuthErrorKey =
  | "invalidCredentials"
  | "emailExists"
  | "invalidEmail"
  | "weakPassword"
  | "network"
  | "notConfigured"
  | "oauthCancelled"
  | "oauthProvider"
  | "unknown";

export function resolveAuthErrorKey(error: unknown): AuthErrorKey {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  if (message.includes("not configured") || message.includes("placeholder")) {
    return "notConfigured";
  }
  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid email or password")
  ) {
    return "invalidCredentials";
  }
  if (
    message.includes("user already registered") ||
    message.includes("already been registered")
  ) {
    return "emailExists";
  }
  if (message.includes("invalid email") || message.includes("unable to validate email")) {
    return "invalidEmail";
  }
  if (message.includes("password") && message.includes("weak")) {
    return "weakPassword";
  }
  if (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("failed to fetch")
  ) {
    return "network";
  }
  if (
    message.includes("provider") &&
    (message.includes("not enabled") || message.includes("disabled"))
  ) {
    return "oauthProvider";
  }
  if (
    message.includes("redirect") ||
    message.includes("oauth") ||
    message.includes("id_token") ||
    message.includes("nonce") ||
    message.includes("audience")
  ) {
    return "oauthProvider";
  }
  if (message.includes("cancel") || message.includes("dismiss")) {
    return "oauthCancelled";
  }
  return "unknown";
}
