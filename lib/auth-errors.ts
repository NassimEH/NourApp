export type AuthErrorKey =
  | "invalidCredentials"
  | "emailExists"
  | "invalidEmail"
  | "weakPassword"
  | "network"
  | "generic";

export function resolveAuthErrorKey(error: unknown): AuthErrorKey {
  const type =
    error &&
    typeof error === "object" &&
    "type" in error &&
    typeof (error as { type: unknown }).type === "string"
      ? (error as { type: string }).type
      : "";

  if (
    type.includes("user_invalid_credentials") ||
    type.includes("invalid_credentials")
  ) {
    return "invalidCredentials";
  }
  if (
    type.includes("user_already_exists") ||
    type.includes("user_email_already_exists")
  ) {
    return "emailExists";
  }
  if (type.includes("password") && type.includes("short")) {
    return "weakPassword";
  }
  if (type.includes("general_invalid_email") || type.includes("invalid_email")) {
    return "invalidEmail";
  }
  if (type.includes("network") || type.includes("fetch")) {
    return "network";
  }
  return "generic";
}
