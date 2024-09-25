<script setup>
import {ref} from "vue";
import {XMarkIcon} from '@heroicons/vue/24/outline'
import {useModalsStore} from "@/stores/modals.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useProductsStore} from "@/stores/products.js";

const loading = ref(false)

const modals = useModalsStore()
const products = useProductsStore()
const notifications = useNotificationStore();

const verifyReview = async (val) => {
  loading.value = true

  try {
    await products.verifyReview(modals.modal.modalData.id, val)
    if (products.verifiedProduct) {
      notifications.showNotification("success", "Успешно", "Продукт успешно верифицирован/отклонен");
      await products.getReviewsList()
      modals.modal.show = false;
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <div>
      <div class="mt-3 text-center sm:mt-5 mb-4">
        <p class="text-base font-semibold leading-6 text-gray-900">
          Верифицировать или отклонить данный отзыв?
        </p>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            Вы уверены, что хотите верифицировать или отклонить данный отзыв?
          </p>
        </div>
      </div>
      <div
          v-if="modals.modal.modalData"
          class="text-gray-500 text-sm">
        <div class="flex gap-2">
          <p>Имя пользователя:</p>
          <p>{{ modals.modal.modalData.user.name }}</p>
        </div>
        <div class="flex gap-2">
          <p>Рейтинг:</p>
          <p>{{ modals.modal.modalData.rating }}</p>
        </div>
        <div class="flex gap-2">
          <p>Продукт:</p>
          <p>{{ modals.modal.modalData.product.name }}</p>
        </div>
        <div class="flex gap-2">
          <p>Комментарий:</p>
          <p>{{ modals.modal.modalData.comment }}</p>
        </div>
        <div>
          <p>Картинки:</p>
          <div class="flex gap-2">
            <img v-for="(item, index) of modals.modal.modalData.images" :key="index" class="w-10 h-10 min-h-10 min-w-10 rounded-md object-cover" :src="item.image_url" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 flex sm:gap-3">
      <button
          v-if="!loading"
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="verifyReview(1)">
        Подтвердить
      </button>
      <div
          v-else
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2">
        <span class="spinner"></span>
      </div>
      <button
          v-if="!loading"
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="verifyReview(0)">
        Отклонить
      </button>
      <div
          v-else
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2">
        <span class="spinner"></span>
      </div>
    </div>
  </div>
</template>