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
                const data = response.data;
                ideasListWithPG.value = data;
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
        async getDetailIdea(id) {
            try {
                const response = await api(`/api/admin/ideas/${id}`, "GET", {}, route.query);
                const data = response.data;
                detailIdea.value = data;
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
        async getIdeasRoomsList() {
            try {
                const response = await api(`/api/admin/ideas/rooms`, "GET", {}, route.query);
                const data = response.data;
                ideaRooms.value = data;
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
        async getIdeasColorsList() {
            try {
                const response = await api(`/api/admin/ideas/colors`, "GET", {}, route.query);
                const data = response.data;
                ideaColors.value = data;
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
        async createIdea(form) {
            try {
                const response = await api(`/api/admin/ideas`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                createdIdea.value = data;
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
        async removeIdea(id) {
            try {
                const response = await api(`/api/admin/ideas/${id}`, "DELETE", {}, route.query);
                const data = response.data;
                removedIdea.value = data;
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
        async editIdea(id, form) {
            try {
                const response = await api(`/api/admin/ideas/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                editedIdea.value = data;
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
    };
});
