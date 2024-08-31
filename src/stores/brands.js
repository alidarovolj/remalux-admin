import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useBrandsStore = defineStore('brands', () => {
    const brandsList = ref(null);
    const createdBrand = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        brandsList,
        createdBrand,
        async getBrandsList() {
            try {
                const response = await api(`/api/admin/brands`, "GET", {}, route.query);
                const data = response.data;
                brandsList.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createBrand(form) {
            try {
                const response = await api(`/api/admin/brands`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                createdBrand.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        createdBrand.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        createdBrand.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    createdBrand.value = false;
                }
            }
        },
    };
});
