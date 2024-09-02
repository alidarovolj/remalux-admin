import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";


export const useProductsStore = defineStore('products', () => {
    const route = useRoute();
    const productsList = ref(null);
    const productVariantsListAll = ref(null);
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
        productVariantsListAll,
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
                
                productsList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getProductVariantsList(search) {
            try {
                if(!search) {
                    const response = await api(`/api/admin/product-variants/`, "GET", {}, route.query);
                    productVariantsList.value = response;
                } else {
                    const response = await api(`/api/admin/product-variants/`, "GET", {}, {
                        'searchKeyword': search
                    });
                    productVariantsList.value = response;
                }
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getProductVariantsListAll(search) {
            try {
                const response = await api(`/api/admin/product-variants/all`, "GET", {}, route.query);
                productVariantsListAll.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async createProduct(form) {
            try {
                const response = await api(`api/admin/products`, "POST", {
                    body: JSON.stringify(form)
                }, route.query);
                
                createdProduct.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async detailProduct(id, form) {
            try {
                const response = await api(`api/admin/products/${id}`, "GET");
                
                detailProductResult.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async editProduct(id, form) {
            try {
                const response = await api(`api/admin/products/${id}`, "PUT", {
                    body: JSON.stringify(form)
                }, route.query);
                
                editedProduct.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async setActive(id, form) {
            try {
                const response = await api(`api/admin/products/${id}`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                
                activeResult.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async removeProduct(id) {
            try {
                const response = await api(`api/admin/products/${id}`, "DELETE", {}, route.query);
                
                removedProduct.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async changePriceVariant(id, form) {
            try {
                const response = await api(`api/admin/product-variants/${id}/prices`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                
                changedVariantPrice.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async changeRemainsVariant(id, form) {
            try {
                const response = await api(`api/admin/product-variants/${id}/remains`, "PATCH", {
                    body: JSON.stringify(form)
                }, route.query);
                
                changedVariantRemains.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});
