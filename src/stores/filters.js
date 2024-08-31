import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from "@/utils/axios.js";
import { useNotificationStore } from "@/stores/notifications.js";
import { useRoute } from "vue-router";

export const useFiltersStore = defineStore('filters', () => {
    const filtersList = ref(null);
    const filtersListByCategory = ref(null);
    const filtersListWithPG = ref(null);
    const createdFilter = ref(null);
    const removedFilter = ref(null);
    const filterValues = ref(null);
    const filterDetail = ref(null);
    const editedFilter = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        filtersList,
        filtersListByCategory,
        filtersListWithPG,
        createdFilter,
        removedFilter,
        filterValues,
        filterDetail,
        editedFilter,
        async getFiltersList() {
            try {
                const response = await api(`/api/filters/all`, "GET", {}, route.query);
                const data = response.data;
                filtersList.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getFiltersListWithPG() {
            try {
                const response = await api(`/api/admin/filters/paginated`, "GET", {}, route.query);
                const data = response.data;
                filtersListWithPG.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getFiltersListByCategory(id) {
            try {
                const response = await api(`api/admin/categories/${id}/filters`, "GET", {}, route.query);
                const data = response.data;
                filtersListByCategory.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createFilter(form) {
            try {
                const response = await api(`/api/admin/filters`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                createdFilter.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeFilter(id) {
            try {
                const response = await api(`/api/admin/filters/${id}`, "DELETE", {}, route.query);
                const data = response.data;
                removedFilter.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getFilterValues(id, value) {
            try {
                const response = await api(`/api/admin/filters/${id}/values?searchKeyword=${value}`, "GET", {}, route.query);
                const data = response.data;
                filterValues.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getDetailFilter(id) {
            try {
                const response = await api(`/api/admin/filters/${id}`, "GET", {}, route.query);
                const data = response.data;
                filterDetail.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editFilter(id, value) {
            try {
                const response = await api(`/api/admin/filters/${id}`, "PUT", {
                    body: JSON.stringify(value)
                }, route.query);
                const data = response.data;
                editedFilter.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});
