export function getToken() {
    // Usamos sessionStorage (con doble 's' y 'a')
    return sessionStorage.getItem("token");
}

export function setToken(token) {
    sessionStorage.setItem("token", token);
}

export function clearToken() {
    sessionStorage.removeItem("token");
}