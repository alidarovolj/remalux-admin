import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";

export const useContactsStore = defineStore('contacts', () => {
    const contactsList = ref(null);
    const citiesList = ref(null);
    const createdContact = ref(null);
    const removedContact = ref(null);
    const detailContact = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        contactsList,
        citiesList,
        createdContact,
        removedContact,
        detailContact,
        async getContacts() {
            try {
                const response = await api(`/api/admin/contacts/`, "GET", {}, route.query);
                const data = response.data;
                contactsList.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getDetailContact(id) {
            try {
                const response = await api(`/api/admin/contacts/${id}`, "GET", {}, route.query);
                const data = response.data;
                detailContact.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getCities() {
            try {
                const response = await api(`/api/admin/contacts/cities`, "GET", {}, route.query);
                const data = response.data;
                citiesList.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createContact(body) {
            try {
                const response = await api(`/api/admin/contacts`, "POST", {
                    body: JSON.stringify(body)
                }, route.query);
                const data = response.data;
                createdContact.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeContact(id) {
            try {
                const response = await api(`/api/admin/contacts/${id}`, "DELETE", {}, route.query);
                const data = response.data;
                removedContact.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});
