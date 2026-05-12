import axios from "axios";
import { useAuthStore } from "../store/authStore";

//create axios instance
export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    withCredentials:true,
    headers: {
        "Content-Type":"application/json"
    }
});

//before sending request add token with it
axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token!)
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async(error) => {
        const original = error.config

        if(error.response?.status === 401 && !original._retry && !isRefreshing){
            original._retry = true
            isRefreshing = true

            try {
                const res = await axios.post('/api/auth/refresh',{},{
                    withCredentials:true,
                })
                const newToken = res.data.data.accessToken
                useAuthStore.getState().setToken(newToken)
                processQueue(null, newToken)
                original.headers.Authorization = `Bearer ${newToken}`
                return axiosInstance(original) //Retry the request
            } catch (err) {
                processQueue(err, null)
                useAuthStore.getState().clearAuth()
                window.location.href = '/login'
                return Promise.reject(err)
            } finally {
                isRefreshing = false
            }
        }

        if(error.response?.status === 401 && isRefreshing){
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token) => {
                        original.headers.Authorization = `Bearer ${token}`
                        resolve(axiosInstance(original))
                    },
                    reject,
                })
            })
        }
        return Promise.reject(error)
    }
)

export default axiosInstance;