import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useNewsStore = defineStore('news', () => {
    const newsListWithPG = ref(null);
    const newsCategories = ref(null);
    const createdNews = ref(null);
    const editedNews = ref(null);
    const detailNews = ref(null);
    const removedNews = ref(null);
    const createdNewsCategory = ref(null);
    const editedNewsCategory = ref(null);
    const removedNewsCategory = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        newsListWithPG,
        newsCategories,
        createdNews,
        editedNews,
        detailNews,
        removedNews,
        createdNewsCategory,
        editedNewsCategory,
        async getNewsListWithPG() {
            try {
                const response = await api(`/api/admin/news`, "GET", {}, route.query);
                const data = response.data;
                newsListWithPG.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getDetailNews(id) {
            try {
                const response = await api(`/api/admin/news/${id}`, "GET", {}, route.query);
                const data = response.data;
                detailNews.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getNewsCategories() {
            try {
                const response = await api(`/api/admin/news/categories/all`, "GET", {}, route.query);
                const data = response.data;
                newsCategories.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createNews(form) {
            try {
                const response = await api(`/api/admin/news`, "POST", {
                    body: JSON.stringify(form),
                }, route.query);
                const data = response.data;
                createdNews.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createNewsCategory(form) {
            try {
                const response = await api(`/api/admin/news/categories`, "POST", {
                    body: JSON.stringify(form),
                }, route.query);
                const data = response.data;
                createdNewsCategory.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editNews(id, form) {
            try {
                const response = await api(`/api/admin/news/${id}`, "PUT", {
                    body: JSON.stringify(form),
                }, route.query);
                const data = response.data;
                editedNews.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editNewsCategory(id, form) {
            try {
                const response = await api(`api/admin/news/categories/${id}`, "PUT", {
                    body: JSON.stringify(form),
                }, route.query);
                const data = response.data;
                editedNewsCategory.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeNews(id, form) {
            try {
                const response = await api(`/api/admin/news/${id}`, "DELETE", {
                    body: JSON.stringify(form),
                }, route.query);
                const data = response.data;
                removedNews.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeNewsCategory(id, form) {
            try {
                const response = await api(`/api/admin/news/categories/${id}`, "DELETE", {
                    body: JSON.stringify(form),
                }, route.query);
                const data = response.data;
                removedNewsCategory.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        }
    };
});
