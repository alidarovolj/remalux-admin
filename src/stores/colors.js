import {defineStore} from "pinia";
import {ref} from "vue";
import {useNotificationStore} from "@/stores/notifications.js";
import {api} from "@/utils/axios.js";
import {useRoute} from "vue-router";
import axios from "axios";

export const useColorsStore = defineStore("colors", () => {
    const colorsList = ref(null);
    const colorGroupList = ref(null);
    const createdColorGroup = ref(null);
    const detailColorGroup = ref(null);
    const addedToColorGroup = ref(null);
    const updatedColorGroup = ref(null);
    const removedColorGroupColor = ref(null);
    const editedColor = ref(null);
    const token = ref(localStorage.getItem('token'));
    const notifications = useNotificationStore()
    const route = useRoute()

    return {
        colorsList,
        colorGroupList,
        createdColorGroup,
        detailColorGroup,
        addedToColorGroup,
        updatedColorGroup,
        removedColorGroupColor,
        editedColor,
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
        async removeColorGroupColor(id, colorId) {
            try {
                const response = await api(`/api/admin/groups/${id}/colors/${colorId}`, "DELETE", {}, {});

                removedColorGroupColor.value = response;
                notifications.showNotification("success", "Успешно", "Цвет удален из группы");
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editColor(id, form) {
            try {
                const response = await api(`/api/admin/colors/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, {});

                editedColor.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async downloadColors() {
            try {
                const response = await axios.get(import.meta.env.VITE_APP_BASE_URL + '/api/colors/download', {
                    responseType: 'blob',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token.value}`,
                    }
                });

                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'colors.xlsx');
                document.body.appendChild(link);
                link.click();

                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);

                notifications.showNotification("success", "Файл успешно загружен");
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка при загрузке файла", e);
            }
        },
    };
});