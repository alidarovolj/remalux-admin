<script setup>
import {CheckIcon, XMarkIcon} from '@heroicons/vue/24/outline'
import {useModalsStore} from "@/stores/modals.js";
import {ref} from "vue";
import {useNotificationStore} from "@/stores/notifications.js";
import {useOrdersStore} from "@/stores/orders.js";

const loading = ref(false)

const modals = useModalsStore()
const notifications = useNotificationStore();
const orders = useOrdersStore()

const form = ref({
  status: ''
})

const updateStatus = async () => {
  loading.value = true

  if (modals.modal.modalData.status === 'created') {
    form.value.status = 'in_process'
  } else if (modals.modal.modalData.status === 'in_process') {
    form.value.status = 'ended'
  }

  try {
    await orders.updateStatus(modals.modal.modalData.id, form.value)
    if (orders.updatedStatus) {
      notifications.showNotification("success", "Успешно", "Статус заказа успешно обновлен");
      await orders.getOrders()
      await orders.getOrdersDetail(modals.modal.modalData.id)
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
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true"/>
      </div>
      <div class="mt-3 text-center sm:mt-5">
        <p
            v-if="modals.modal.modalData.status === 'created'"
            class="text-base font-semibold leading-6 text-gray-900">
          Хотите сменить статус заказа на <span class="text-mainColor">"в прогрессе"</span>
        </p>
        <p
            v-if="modals.modal.modalData.status === 'in_process'"
            class="text-base font-semibold leading-6 text-gray-900">
          Хотите сменить статус заказа на <span class="text-mainColor">"завершенный"</span>
        </p>
        <p
            v-else
            class="text-base font-semibold leading-6 text-gray-900">
          Данный заказ уже завершен
        </p>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            После подтверждения изменения статуса заказа, изменения будут немедленно применены.
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 flex gap-5">
      <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          @click="modals.modal.show = false"
          ref="cancelButtonRef">
        Отменить
      </button>
      <div
          v-if="modals.modal.modalData.status !== 'ended'"
          class="w-full">
        <button
            v-if="!loading"
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
            @click="updateStatus"
        >
          Подтвердить
        </button>
        <div
            v-else
            class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2">
          <span class="spinner"></span>
        </div>
      </div>
    </div>
  </div>
</template>