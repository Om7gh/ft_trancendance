import axios from "axios";

const axiosApiInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
})

let isRefreshing = false;

type FailedQueueType = {
    resolve: ((value: unknown) => void);
    reject: ((reasion?: any) => void);
}

let failedQueue : FailedQueueType[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(undefined);
  });

  failedQueue = [];
};

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the requests until refresh is done
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosApiInstance(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Request a new access token using refresh token (usually cookie)
      await axiosApiInstance.post("/auths/refresh");

      processQueue(null);
      return axiosApiInstance(originalRequest);
    } catch (err) {
      processQueue(err);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosApiInstance;
