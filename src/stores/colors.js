import {defineStore} from "pinia";
import {ref} from "vue";
import {useNotificationStore} from "@/stores/notifications.js";
import {api} from "@/utils/axios.js";
import {useRoute} from "vue-router";

export const useColorsStore = defineStore("colors", () => {
    const colorsList = ref(null);
    const notifications = useNotificationStore()
    const route = useRoute()

    return {
        colorsList,
        async getColors(search) {
            try {
                console.log(search)
                const response = await api(`/api/colors`, "GET", {}, {
                    'searchKeyword': search
                });

                colorsList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});