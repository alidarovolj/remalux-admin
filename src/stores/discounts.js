import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useDiscountStore = defineStore('discount', () => {
    const discountList = ref(null);
    const createdDiscount = ref(null);
    const editedDiscount = ref(null);
    const removedDiscount = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        discountList,
        createdDiscount,
        editedDiscount,
        removedDiscount,
        async getDiscountList() {
            try {
                const response = await api(`/api/admin/discounts`, "GET", {}, route.query);

                discountList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createDiscount(form) {
            try {
                const response = await api(`/api/admin/discounts`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);

                createdDiscount.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editDiscount(id, form) {
            try {
                const response = await api(`/api/admin/discounts/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);

                editedDiscount.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeDiscount(id) {
            try {
                const response = await api(`/api/admin/discounts/${id}`, "DELETE", {}, route.query);

                removedDiscount.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        }
    };
});
