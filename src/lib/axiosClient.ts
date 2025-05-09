import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';

// Axios instance
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add accessToken into request
axiosClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Refresh token when 401
type FailedRequest = {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
};

let isRefreshing = false;
const failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue.length = 0;
};

axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(axiosClient(originalRequest));
                        },
                        reject: (err: unknown) => reject(err),
                    });
                })
            }

            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                const res = await axios.post('http://localhost:5000/api/auth/refresh-token', {
                    refreshToken,
                });

                const {accessToken, refreshToken: newRefreshToken, accessTokenExpires} = res.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                localStorage.setItem('tokenExpireAt', (Date.now() + accessTokenExpires * 1000).toString());

                axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                originalRequest.headers.common.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                return axiosClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                if (typeof window !== 'undefined') {
                    localStorage.clear();
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
)

export default axiosClient;