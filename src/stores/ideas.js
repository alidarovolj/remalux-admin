import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useIdeasStore = defineStore('ideas', () => {
    const ideasListWithPG = ref(null);
    const createdIdea = ref(null);
    const ideaRooms = ref(null);
    const ideaColors = ref(null);
    const removedIdea = ref(null);
    const detailIdea = ref(null);
    const editedIdea = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        ideasListWithPG,
        createdIdea,
        ideaRooms,
        ideaColors,
        removedIdea,
        detailIdea,
        editedIdea,
        async getIdeasListWithPG() {
            try {
                const response = await api(`/api/admin/ideas`, "GET", {}, route.query);
                
                ideasListWithPG.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getDetailIdea(id) {
            try {
                const response = await api(`/api/admin/ideas/${id}`, "GET", {}, route.query);
                detailIdea.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getIdeasRoomsList() {
            try {
                const response = await api(`/api/admin/ideas/rooms`, "GET", {}, route.query);
                
                ideaRooms.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getIdeasColorsList() {
            try {
                const response = await api(`/api/admin/ideas/colors`, "GET", {}, route.query);
                
                ideaColors.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createIdea(form) {
            try {
                const response = await api(`/api/admin/ideas`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                
                createdIdea.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
                createdIdea.value = false
            }
        },
        async removeIdea(id) {
            try {
                const response = await api(`/api/admin/ideas/${id}`, "DELETE", {}, route.query);
                
                removedIdea.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editIdea(id, form) {
            try {
                const response = await api(`/api/admin/ideas/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);
                
                editedIdea.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});
