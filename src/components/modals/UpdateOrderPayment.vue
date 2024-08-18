<script setup>
import {CheckIcon, XMarkIcon} from '@heroicons/vue/24/outline'
import {useModalsStore} from "@/stores/modals.js";
import {ref} from "vue";
import {useNotificationStore} from "@/stores/notifications.js";
import {useOrdersStore} from "@/stores/orders.js";

const loading = ref(false)

const modals = useModalsStore()
const orders = useOrdersStore()
const notifications = useNotificationStore();

const form = ref({
  is_paid: null
})

const setPayStatus = async () => {
  loading.value = true

  if (modals.modal.modalData.is_paid === true) {
    form.value.is_paid = 0
  } else {
    form.value.is_paid = 1
  }

  await orders.setPaymentStatus(modals.modal.modalData.id, form.value)
  if (orders.paymentStatus !== false) {
    notifications.showNotification("success", "Успешно", "Статус оплаты успешно обновлен");
    await orders.getOrders()
    await orders.getOrdersDetail(modals.modal.modalData.id)
    modals.modal.show = false;
  } else {
    notifications.showNotification("error", "Ошибка", orders.paymentStatus.message);
  }
  loading.value = false
}
</script>

<template>
  <div>
    <div>
      <div
          v-if="!modals.modal.modalData.is_paid"
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true"/>
      </div>
      <div
          v-else
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <XMarkIcon class="h-6 w-6 text-red-600" aria-hidden="true"/>
      </div>
      <div class="mt-3 text-center sm:mt-5">
        <p
            v-if="!modals.modal.modalData.is_paid"
            class="text-base font-semibold leading-6 text-gray-900">
          Хотите уставновить статус "оплачен" для заказа?
        </p>
        <p
            v-else
            class="text-base font-semibold leading-6 text-gray-900">
          Заказ уже оплачен. Хотите отменить оплату?
        </p>
        <div
            v-if="!modals.modal.modalData.is_paid"
            class="mt-2">
          <p class="text-sm text-gray-500">
            После подтверждения заказ будет помечен как оплаченный.
          </p>
        </div>
        <div
            v-else
            class="mt-2">
          <p class="text-sm text-gray-500">
            После подтверждения заказ будет помечен как неоплаченный.
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="setPayStatus"
      >
        Подтвердить
      </button>
      <div
          v-else
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2">
        <span class="spinner"></span>
      </div>
      <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          @click="modals.modal.show = false"
          ref="cancelButtonRef">
        Отменить
      </button>
    </div>
  </div>
</template>