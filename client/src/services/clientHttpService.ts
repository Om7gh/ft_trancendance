import axios, {
    type AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let isRefreshing = false;

type FailedRequestQueueType = {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
};

let failedRequestQueue: FailedRequestQueueType[] = [];

function processRequestsQueue(error: unknown) {
    failedRequestQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(undefined);
        }
    });

    failedRequestQueue = [];
}

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (
            !originalRequest ||
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url === '/api/auth/refresh'
        ) {
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
            await api.post('/api/auth/refresh', null, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            processRequestsQueue(null);
            return await api(originalRequest);
        } catch (refreshError) {
            processRequestsQueue(refreshError);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
