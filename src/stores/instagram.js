import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useRoute} from "vue-router";
import router from "@/router/index.js";

export const useInstagramStore = defineStore('instagram', () => {
    const list = ref(null);
    const create = ref(null);
    const update = ref(null);
    const detail = ref(null);
    const remove = ref(null);
    const route = useRoute();

    return {
        list,
        create,
        update,
        detail,
        remove,
        async getList() {
            try {
                const response = await api(`/api/instagram-posts`, "GET", {}, route.query);
                list.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getDetail() {
            try {
                const response = await api(`/api/admin/instagram-posts/${id}`, "GET", {}, route.query);

                list.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createPost(form) {
            try {
                const response = await api(`/api/admin/instagram-posts`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);

                create.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editPost(id, form) {
            try {
                const response = await api(`/api/admin/instagram-posts/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);
                
                update.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removePost(id) {
            try {
                const response = await api(`/api/admin/instagram-posts/${id}`, "DELETE");
                
                removedUser.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        }
    };
});
