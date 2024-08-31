import { ref } from "vue";
import { stringify } from "qs";
import { defu } from "defu";
import axios from "axios";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/notifications.js";

export async function api(url, method, options = {}, query = {}) {
    const token = ref(localStorage.getItem('token'));
    const router = useRouter();
    const notifications = useNotificationStore();

    const defaultPage = query.page || 1;
    const defaultPerPage = query.perPage || 10;

    const params = {
        ...query,
        page: defaultPage,
        perPage: defaultPerPage,
        ...options.params,
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
    };

    const config = defu(options, {
        baseURL: import.meta.env.VITE_APP_BASE_URL,
        headers: headers,
        method: method,
        url: url,
        params,
        paramsSerializer: params => stringify(params, {
            encode: false,
            allowDots: true,
            skipNulls: true
        })
    });

    if (options.body) {
        config.data = options.body; // Directly using options.body, assuming it's already parsed or properly formatted
    }

    try {
        const response = await axios(config);
        return response.data; // Return only the data to match the first function's behavior
    } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            notifications.showNotification("error", "Токен не получен или истек", "Пожалуйста, авторизуйтесь снова");
            localStorage.removeItem("token");
            router.push('/login');
        } else {
            console.error("API Error:", error.response || error.message);
            throw new Error(error.response?.data?.message || 'Request failed');
        }
    }
}
