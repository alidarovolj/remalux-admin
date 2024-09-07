import {defineStore} from "pinia";
import {ref} from "vue";
import {useNotificationStore} from "@/stores/notifications.js";
import {api} from "@/utils/axios.js";
import {useRoute} from "vue-router";

export const usePartnersStore = defineStore("partners", () => {
    const partnersList = ref(null);
    const notifications = useNotificationStore()
    const route = useRoute()

    return {
        partnersList,
        async getPartners(search) {
            try {
                console.log(search)
                const response = await api(`/api/admin/partners`, "GET", {}, {
                    'searchKeyword': search
                });

                partnersList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});