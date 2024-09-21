import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useQuestionsStore = defineStore('questions', () => {
    const questionsList = ref(null);
    const detailQuestion = ref(null);
    const answeredQuestion = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        questionsList,
        detailQuestion,
        answeredQuestion,
        async getQuestions() {
            try {
                const response = await api(`/api/admin/questions`, "GET", {}, route.query);

                questionsList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getDetailQuestion(id) {
            try {
                const response = await api(`/api/admin/questions/${id}`, "GET", {}, route.query);

                detailQuestion.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async answerQuestion(id, form) {
            try {
                const response = await api(`/api/admin/questions/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);

                answeredQuestion.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        }
    };
});
