<script setup>
import {CheckIcon, XMarkIcon} from '@heroicons/vue/24/outline'
import {useModalsStore} from "@/stores/modals.js";
import {ref} from "vue";
import {useNotificationStore} from "@/stores/notifications.js";
import {useCategoriesStore} from "@/stores/categories.js";

const loading = ref(false)

const modals = useModalsStore()
const categories = useCategoriesStore()
const notifications = useNotificationStore();

const form = ref({
  is_active: null
})

const setActive = async () => {
  loading.value = true

  if (modals.modal.modalData.is_active === true) {
    form.value.is_active = 0
  } else {
    form.value.is_active = 1
  }

  try {
    await categories.setActive(modals.modal.modalData.id, form.value)
    if (categories.activeResult) {
      notifications.showNotification("success", "Успешная смена статуса категории", "Статус категории успешно изменен, теперь категория доступна/недоступна для пользователей");
      await categories.getCategoriesListWithPG()
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
      <div
          v-if="!modals.modal.modalData.is_active"
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
            v-if="!modals.modal.modalData.is_active"
            class="text-base font-semibold leading-6 text-gray-900">
          Хотите активировать категорию?
        </p>
        <p
            v-else
            class="text-base font-semibold leading-6 text-gray-900">
          Данная категория уже активирована
        </p>
        <div
            v-if="!modals.modal.modalData.is_active"
            class="mt-2">
          <p class="text-sm text-gray-500">
            После деактивации категория станет недоступна для пользователей
          </p>
        </div>
        <div
            v-else
            class="mt-2">
          <p class="text-sm text-gray-500">
            После активации категория станет доступна для пользователей
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="setActive"
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