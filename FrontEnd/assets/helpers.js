export function setToken(token) {
  localStorage.setItem("localToken", token);
}

export function getToken() {
  return localStorage.getItem("localToken");
}

export function removeToken() {
  localStorage.removeItem("localToken");
}
