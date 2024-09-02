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
    const authorizedUser = ref(null);
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
        authorizedUser,
        async getProfile() {
            try {
                const response = await api(`/api/auth/me`, "GET", {}, route.query);
                
                userProfile.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async authUser(form) {
            try {
                const response = await api(`/api/auth/admin/login`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                
                authorizedUser.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getUserList() {
            try {
                const response = await api(`/api/admin/users`, "GET", {}, route.query);
                
                userList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createUser(form) {
            try {
                const response = await api(`/api/admin/users`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                
                createdUser.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editUser(id, form) {
            try {
                const response = await api(`/api/admin/users/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);
                
                editedUser.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async setAdmin(id, form) {
            try {
                const response = await api(`/api/admin/users/${id}/role`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                
                checkAdmin.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async changePassword(id, form) {
            try {
                const response = await api(`/api/admin/users/${id}`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                
                changedPassword.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeUser(id) {
            try {
                const response = await api(`/api/admin/users/${id}`, "DELETE");
                
                removedUser.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        }
    };
});
