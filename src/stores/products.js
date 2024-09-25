import {defineStore} from 'pinia';
import {ref} from 'vue';
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useRoute} from "vue-router";
import axios from "axios";

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
    const downloadedVariants = ref(null);
    const uploadedVariants = ref(null);
    const productsReviews = ref(null);
    const verifiedProduct = ref(null);
    const token = ref(localStorage.getItem('token'));
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
        downloadedVariants,
        uploadedVariants,
        productsReviews,
        verifiedProduct,
        async getProductsList() {
            try {
                const response = await api(`/api/admin/products/`, "GET", {}, route.query);

                productsList.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getReviewsList() {
            try {
                const response = await api(`/api/admin/reviews`, "GET", {}, route.query);

                productsReviews.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async verifyReview(id, val) {
            try {
                const response = await api(`/api/admin/reviews/${id}?is_verified=${val}`, "PATCH", {}, route.query);

                verifiedProduct.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
        async getProductVariantsList(search) {
            try {
                if (!search) {
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
        async downloadVariants() {
            try {
                const response = await axios.get(import.meta.env.VITE_APP_BASE_URL + '/api/admin/product-variants/download', {
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
                link.setAttribute('download', 'variants.xlsx');
                document.body.appendChild(link);
                link.click();

                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);

                notifications.showNotification("success", "Файл успешно загружен");
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка при загрузке файла", e);
            }
        },
        async uploadVariants() {
            try {
                const response = await api(`api/admin/product-variants/unload`, "POST", {}, route.query);

                uploadedVariants.value = response;
            } catch (e) {
                notifications.showNotification("error", "Произошла ошибка", e);
            }
        },
    };
});
