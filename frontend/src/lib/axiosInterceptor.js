import axios from "axios";

// Production backend API URL (AWS EC2 / Elastic Beanstalk: newsapi.newpulse.in)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}
axios.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest.url?.includes("/api/auth/refresh-token") &&
      !originalRequest.url?.includes("/api/auth/signin") &&
      !originalRequest.url?.includes("/api/auth/google") &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          "/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        if (res.status === 200) {
          processQueue(null);
          return axios(originalRequest);
        } else {
          processQueue(new Error("Refresh token failed"));
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
