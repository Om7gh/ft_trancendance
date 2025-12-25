import axios from 'axios';

const axiosApiInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

let isRefreshing = false;

type FailedRequestQueueType = {
  resolve: (value: unknown) => void;
  reject: (reasion?: any) => void;
};

let failedRequestQueue: FailedRequestQueueType[] = [];

function processRequestsQueue(error: unknown) {
  
  failedRequestQueue.forEach((prom) => {
    if (error)
      prom.reject(error);
    else
      prom.resolve(undefined);
  });

  failedRequestQueue = [];
};

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status !== 401) || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestQueue.push({ resolve, reject });
      }).then(() => axiosApiInstance(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;

    isRefreshing = true;

    try {
      await axiosApiInstance.post('/auths/refresh', null);

      processRequestsQueue(null);
      return axiosApiInstance(originalRequest);
    } catch (error) {
      processRequestsQueue(error);
      throw error;
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosApiInstance;
