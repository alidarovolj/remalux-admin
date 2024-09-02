import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from "@/utils/axios.js";
import { useNotificationStore } from "@/stores/notifications.js";
import { useRoute } from "vue-router";

export const useImagesStore = defineStore('images', () => {
    const uploadedImage = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        uploadedImage,
        async getFiltersList() {
            try {
                const response = await api(`/api/filters/all`, "GET", {}, route.query);
                
                uploadedImage.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        }
    };
});
