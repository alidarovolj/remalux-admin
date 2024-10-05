import {defineStore} from "pinia";
import {ref} from "vue";
import {useNotificationStore} from "@/stores/notifications.js";
import {api} from "@/utils/axios.js";
import {useRoute} from "vue-router";

export const useColorsStore = defineStore("colors", () => {
    const colorsList = ref(null);
    const colorGroupList = ref(null);
    const createdColorGroup = ref(null);
    const detailColorGroup = ref(null);
    const addedToColorGroup = ref(null);
    const updatedColorGroup = ref(null);
    const notifications = useNotificationStore()
    const route = useRoute()

    return {
        colorsList,
        colorGroupList,
        createdColorGroup,
        detailColorGroup,
        addedToColorGroup,
        updatedColorGroup,
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
        async getDetailColorGroup(id) {
            try {
                const response = await api(`/api/admin/groups/${id}`, "GET", {}, {});
                detailColorGroup.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async updateColorGroup(id, form) {
            try {
                const response = await api(`/api/admin/groups/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, {});
                updatedColorGroup.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async addToColorGroup(id, form) {
            try {
                const response = await api(`/api/admin/groups/${id}`, "POST", {
                    body: JSON.stringify(form)
                }, {});
                addedToColorGroup.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getColorGroups(search) {
            try {
                console.log(search)
                const response = await api(`/api/admin/groups`, "GET", {}, {
                    'searchKeyword': search
                });

                colorGroupList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createColorGroup(form) {
            try {
                const response = await api(`/api/admin/groups`, "POST", {
                    body: JSON.stringify(form)
                }, {});

                createdColorGroup.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});