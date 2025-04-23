import axios from "axios";

const AXIOS_TIMEOUT = 80 * 1000; //80 seconds
export const X_CHANNEL_ID = "RECEIPT-TRACKER";
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
// api.defaults.headers.common["x-app-id"] = "RECEIPT-TRACKER";

// api.interceptors.request.use(
//   (config) => {
//     const { url } = config;

//     if (ACCESS_TOKEN && !url.includes("login") && !url.includes("logout")) {
//       api.defaults.headers.common["Authorization"] = `Bearer ${ACCESS_TOKEN}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => {
    //NO RESPONSE MANIPULATION
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
      localStorage.clear();
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
