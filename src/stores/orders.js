import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useOrdersStore = defineStore('orders', () => {
    const ordersList = ref(null);
    const updatedStatus = ref(null);
    const paymentStatus = ref(null);
    const ordersDetail = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        ordersList,
        updatedStatus,
        paymentStatus,
        ordersDetail,
        async getOrders() {
            try {
                const response = await api(`/api/admin/orders/`, "GET", {}, route.query);
                
                ordersList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getOrdersDetail(id) {
            try {
                const response = await api(`/api/admin/orders/${id}`, "GET", {}, route.query);
                
                ordersDetail.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async updateStatus(id, form) {
            try {
                const response = await api(`/api/admin/orders/${id}/status`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                
                updatedStatus.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async setPaymentStatus(id, form) {
            try {
                const response = await api(`/api/admin/orders/${id}/paid`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                
                paymentStatus.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        }
    };
});
