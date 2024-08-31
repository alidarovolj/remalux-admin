import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useUsersStore = defineStore('users', () => {
    const userProfile = ref(null);
    const userList = ref(null);
    const createdUser = ref(null);
    const editedUser = ref(null);
    const checkAdmin = ref(null);
    const changedPassword = ref(null);
    const removedUser = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        userProfile,
        userList,
        createdUser,
        editedUser,
        checkAdmin,
        changedPassword,
        removedUser,
        async getProfile() {
            try {
                const response = await api(`/api/auth/me`, "GET", {}, route.query);
                const data = response.data;
                userProfile.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getUserList() {
            try {
                const response = await api(`/api/admin/users`, "GET", {}, route.query);
                const data = response.data;
                userList.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createUser(form) {
            try {
                const response = await api(`/api/admin/users`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                createdUser.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        createdUser.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        createdUser.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    createdUser.value = false;
                }
            }
        },
        async editUser(id, form) {
            try {
                const response = await api(`/api/admin/users/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                editedUser.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        editedUser.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        editedUser.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    editedUser.value = false;
                }
            }
        },
        async setAdmin(id, form) {
            try {
                const response = await api(`/api/admin/users/${id}/role`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                checkAdmin.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        checkAdmin.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        checkAdmin.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    checkAdmin.value = false;
                }
            }
        },
        async changePassword(id, form) {
            try {
                const response = await api(`/api/admin/users/${id}`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                changedPassword.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        changedPassword.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        changedPassword.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    changedPassword.value = false;
                }
            }
        },
        async removeUser(id) {
            try {
                const response = await api(`/api/admin/users/${id}`, "DELETE");
                const data = response.data;
                removedUser.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        removedUser.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        removedUser.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    removedUser.value = false;
                }
            }
        }
    };
});
