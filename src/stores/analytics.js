import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useAnalyticsStore = defineStore('analytics', () => {
    const analyticsList = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        analyticsList,
        async getAnalyticsList() {
            try {
                const response = await api(`/api/admin/analytics`, "GET", {}, route.query);

                analyticsList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});
