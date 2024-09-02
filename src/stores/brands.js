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
                
                brandsList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createBrand(form) {
            try {
                const response = await api(`/api/admin/brands`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                
                createdBrand.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});
