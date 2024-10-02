import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";
import router from "@/router/index.js";

export const useUsersStore = defineStore('users', () => {
    const userProfile = ref(null);
    const profileFetched = ref(false);
    const userList = ref(null);
    const userListAll = ref(null);
    const createdUser = ref(null);
    const editedUser = ref(null);
    const checkAdmin = ref(null);
    const changedPassword = ref(null);
    const removedUser = ref(null);
    const authorizedUser = ref(null);
    const userLogout = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        userProfile,
        userList,
        userListAll,
        createdUser,
        editedUser,
        checkAdmin,
        changedPassword,
        removedUser,
        authorizedUser,
        profileFetched,
        userLogout,
        async getProfile() {
            try {
                const response = await api(`/api/auth/me`, "GET", {}, route.query);
                
                userProfile.value = response;
                profileFetched.value = true;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async logout() {
            try {
                const response = await api(`/api/auth/logout`, "POST", {}, route.query);

                userLogout.value = response;
                localStorage.removeItem("token");
                router.push({name: "Login"});
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
        async getUserListAll() {
            try {
                const response = await api(`/api/admin/users/all`, "GET", {}, route.query);

                userListAll.value = response;
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
