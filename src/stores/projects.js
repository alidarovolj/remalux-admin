import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useProjectsStore = defineStore('projects', () => {
    const projectsList = ref(null);
    const detailProject = ref(null);
    const createdProject = ref(null);
    const removedProject = ref(null);
    const editedProject = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        projectsList,
        detailProject,
        createdProject,
        removedProject,
        editedProject,
        async getProjects() {
            try {
                const response = await api(`/api/projects`, "GET", {}, route.query);

                projectsList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getDetailProject(id) {
            try {
                const response = await api(`/api/admin/projects/${id}`, "GET", {}, route.query);

                detailProject.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createProject(form) {
            try {
                const response = await api(`/api/admin/projects`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);

                createdProject.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editProject(id, form) {
            try {
                const response = await api(`/api/admin/projects/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);

                editedProject.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeProject(id) {
            try {
                const response = await api(`/api/admin/projects/${id}`, "DELETE", {}, route.query);

                removedProject.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        }
    };
});
