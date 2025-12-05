export function hasAuthToken() {
  return document.cookie.includes("auth_token=");
}
