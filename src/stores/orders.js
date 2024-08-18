import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useOrdersStore = defineStore('orders', () => {
    const ordersList = ref(null);
    const updatedStatus = ref(null);
    const paymentStatus = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        ordersList,
        updatedStatus,
        paymentStatus,
        async getOrders() {
            try {
                const response = await api(`/api/admin/orders/`, "GET", {}, route.query);
                const data = response.data;
                ordersList.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                }
            }
        },
        async updateStatus(id, form) {
            try {
                const response = await api(`/api/admin/orders/${id}/status`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                updatedStatus.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                }
            }
        },
        async setPaymentStatus(id, form) {
            try {
                const response = await api(`/api/admin/orders/${id}/paid`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                paymentStatus.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                }
            }
        }
    };
});
