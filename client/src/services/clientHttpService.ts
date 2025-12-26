import axios, {
    type AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios';

export const api = axios.create({
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
        if (error) prom.reject(error);
        else prom.resolve(undefined);
    });

    failedRequestQueue = [];
}

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedRequestQueue.push({ resolve, reject });
            })
                .then(() => api(originalRequest))
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;

        isRefreshing = true;

        try {
            await api.post('/api/auth/refresh', null);

            processRequestsQueue(null);
            return api(originalRequest);
        } catch (error) {
            processRequestsQueue(error);
            throw error;
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
