import axios from 'axios'
import { getToken, clearToken } from './auth'

export const api = axios.create({
    baseURL: 'https://lasspuntacana.com/api',
    timeout: 10000, // 10s hard timeout — kills hung requests
    headers: {
        'Content-Type': 'application/json',
    },
})

// 🔐 Attach JWT automatically
api.interceptors.request.use(async (config) => {
    const token = await getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 🛡️ Response interceptor — retry + normalize + 401 handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const isNetworkError = !error.response

        // 🔁 Retry once on network failure (hotel Wi-Fi, cellular hiccups)
        if (isNetworkError && !error.config?._retry) {
            error.config._retry = true
            await new Promise((r) => setTimeout(r, 800))
            return api(error.config)
        }

        // 🚪 Auto-clear token on 401 (expired JWT)
        if (error.response?.status === 401) {
            await clearToken()
        }

        // 🧹 Normalize error message for clean UI display
        const message =
            error.response?.data?.error ||
            error.message ||
            'Unexpected error'

        return Promise.reject(new Error(message))
    }
)
