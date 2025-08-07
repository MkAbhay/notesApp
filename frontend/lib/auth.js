import Cookies from "js-cookie";
export const setToken = (t) => Cookies.set("token", t);
export const getToken = () => Cookies.get("token");
export const clearToken = () => Cookies.remove("token");
