import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";


export const useProductsStore = defineStore('products', () => {
    const route = useRoute();
    const productsList = ref(null);
    const createdProduct = ref(null);
    const editedProduct = ref(null);
    const detailProductResult = ref(null);
    const activeResult = ref(null);
    const removedProduct = ref(null);
    const productVariantsList = ref(null);
    const changedVariantPrice = ref(null);
    const changedVariantRemains = ref(null);
    const notifications = useNotificationStore()

    return {
        productsList,
        createdProduct,
        editedProduct,
        detailProductResult,
        activeResult,
        removedProduct,
        productVariantsList,
        changedVariantPrice,
        changedVariantRemains,
        async getProductsList() {
            try {
                const response = await api(`/api/admin/products/`, "GET", {}, route.query);
                const data = response.data;
                productsList.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getProductVariantsList() {
            try {
                const response = await api(`/api/admin/product-variants/`, "GET", {}, route.query);
                const data = response.data;
                productVariantsList.value = data;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createProduct(form) {
            try {
                const response = await api(`api/admin/products`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                createdProduct.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        createdProduct.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        createdProduct.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    createdProduct.value = false;
                }
            }
        },
        async detailProduct(id, form) {
            try {
                const response = await api(`api/admin/products/${id}`, "GET");
                const data = response.data;
                detailProductResult.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        detailProductResult.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        detailProductResult.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    detailProductResult.value = false;
                }
            }
        },
        async editProduct(id, form) {
            try {
                const response = await api(`api/admin/products/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                editedProduct.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        editedProduct.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        editedProduct.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    editedProduct.value = false;
                }
            }
        },
        async setActive(id, form) {
            try {
                const response = await api(`api/admin/products/${id}`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                activeResult.value = data;
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
        async removeProduct(id) {
            try {
                const response = await api(`api/admin/products/${id}`, "DELETE", {}, route.query);
                const data = response.data;
                removedProduct.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        removedProduct.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        removedProduct.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    removedProduct.value = false;
                }
            }
        },
        async changePriceVariant(id, form) {
            try {
                const response = await api(`api/admin/product-variants/${id}/prices`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                changedVariantPrice.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        changedVariantPrice.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        changedVariantPrice.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    changedVariantPrice.value = false;
                }
            }
        },
        async changeRemainsVariant(id, form) {
            try {
                const response = await api(`api/admin/product-variants/${id}/remains`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                const data = response.data;
                changedVariantRemains.value = data;
            } catch (e) {
                if (e.response) {
                    if (e.response.status !== 500) {
                        notifications.showNotification("error", "Произошла ошибка", e.response.data.message);
                        changedVariantRemains.value = false;
                    } else {
                        notifications.showNotification("error", "Ошибка сервера!", "Попробуйте позже.");
                        changedVariantRemains.value = false;
                    }
                } else {
                    console.error(e);
                    notifications.showNotification("error", "Произошла ошибка", "Неизвестная ошибка");
                    changedVariantRemains.value = false;
                }
            }
        },
    };
});
