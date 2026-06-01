const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function isValidPassword(password: string, minLength = 8): boolean {
  return password.length >= minLength;
}

export function passwordsMatch(a: string, b: string): boolean {
  return a === b;
}
