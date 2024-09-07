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
    const editedContact = ref(null);
    const notifications = useNotificationStore();
    const route = useRoute();

    return {
        contactsList,
        citiesList,
        createdContact,
        removedContact,
        detailContact,
        editedContact,
        async getContacts() {
            try {
                const response = await api(`/api/admin/contacts/`, "GET", {}, route.query);
                
                contactsList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getDetailContact(id) {
            try {
                const response = await api(`/api/admin/contacts/${id}`, "GET", {}, route.query);
                
                detailContact.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getCities() {
            try {
                const response = await api(`/api/admin/contacts/cities`, "GET", {}, route.query);
                
                citiesList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createContact(body) {
            try {
                const response = await api(`/api/admin/contacts`, "POST", {
                    body: JSON.stringify(body)
                }, route.query);
                
                createdContact.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editContact(id, body) {
            try {
                const response = await api(`/api/admin/contacts/${id}`, "PUT", {
                    body: JSON.stringify(body)
                }, route.query);

                editedContact.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeContact(id) {
            try {
                const response = await api(`/api/admin/contacts/${id}`, "DELETE", {}, route.query);
                
                removedContact.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});
