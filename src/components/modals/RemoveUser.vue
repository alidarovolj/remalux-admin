<script setup>
import {XMarkIcon} from '@heroicons/vue/24/outline'
import {useModalsStore} from "@/stores/modals.js";
import {ref} from "vue";
import {useUsersStore} from "@/stores/users.js";
import {useNotificationStore} from "@/stores/notifications.js";

const loading = ref(false)

const modals = useModalsStore()
const users = useUsersStore()
const notifications = useNotificationStore();

const form = ref({
  is_admin: null
})

const removeUser = async () => {
  loading.value = true

  try {
    await users.removeUser(modals.modal.modalData.id)
    if (users.removedUser) {
      notifications.showNotification("success", "Пользователь успешно удален", "Пользователь успешно удален из системы и не сможет войти в нее.");
      await users.getUserList()
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
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <XMarkIcon class="h-6 w-6 text-red-600" aria-hidden="true"/>
      </div>
      <div class="mt-3 text-center sm:mt-5">
        <p class="text-base font-semibold leading-6 text-gray-900">
          Хотите удалить пользователя?
        </p>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            Пользователь будет удален из системы и не сможет войти в нее.
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="removeUser"
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