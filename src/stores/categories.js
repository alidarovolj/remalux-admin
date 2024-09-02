import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useCategoriesStore = defineStore('categories', () => {
    const categoriesList = ref(null);
    const categoriesListWithPG = ref(null);
    const createdCategory = ref(null);
    const activeResult = ref(null);
    const editedCategory = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        categoriesList,
        categoriesListWithPG,
        createdCategory,
        activeResult,
        editedCategory,
        async getCategoriesList() {
            try {
                const response = await api(`/api/admin/categories/all`, "GET", {}, route.query);
                
                categoriesList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getCategoriesListWithPG() {
            try {
                const response = await api(`/api/admin/categories`, "GET", {}, route.query);
                
                categoriesListWithPG.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createCategory(form) {
            try {
                const response = await api(`/api/admin/categories`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                
                createdCategory.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editCategory(id, form) {
            try {
                const response = await api(`/api/admin/categories/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);
                
                editedCategory.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async setActive(id, form) {
            try {
                const response = await api(`api/admin/categories/${id}`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                
                activeResult.value = response;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        activeResult.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        activeResult.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    activeResult.value = false;
                }
            }
        },
    };
});
