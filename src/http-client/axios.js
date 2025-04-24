import axios from "axios";
import useAuthStore from "stores/AuthStore/AuthStore";

const AXIOS_TIMEOUT = 100 * 1000; //100 seconds
export const X_CHANNEL_ID = "ADMIN-PANEL";
const ACCESS_TOKEN = localStorage.getItem("token");

const API_ENDPOINTS = {
  PROD: `https://dsaadmin.in/act`,
  STAGE: `https://dsaadmin.in/act`,
  LOCAL: `https://dsaadmin.in/act`,
};

//BASE URL MAP
const BASE_URI_MAP = {
  "act-module-prod.netlify.app": API_ENDPOINTS.STAGE,
  "act-module.netlify.app": API_ENDPOINTS.PROD,
  localhost: API_ENDPOINTS.LOCAL,
};

export const hostName = window.location.hostname;

export const API_BASE_URL = BASE_URI_MAP[hostName];

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: AXIOS_TIMEOUT,
});

api.defaults.headers.common["origin"] = "tcaplay.com";

api.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  async (error) => {
    const { response } = error;
    const url = response.config.url;

    if (
      response.status === 401 &&
      !url.includes("login") &&
      !url.includes("logout")
    ) {
      useAuthStore.getState().clearUserData();
      window.location.href = "/login";
    } else {
      //IF AUTH API RETURN THE ERROR
      return Promise.reject(error);
    }
  }
);

if (ACCESS_TOKEN) {
  api.defaults.headers.common["Authorization"] = `Bearer ${ACCESS_TOKEN}`;
}

export default api;
