<script setup>
import {vMaska} from "maska/vue"
import {onMounted, ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notifications.js";
import {useUsersStore} from "@/stores/users.js";
import {useModalsStore} from "@/stores/modals.js";

const notifications = useNotificationStore();
const users = useUsersStore();
const modals = useModalsStore()

const loading = ref(false);

const formEdit = ref({
  name: "",
  phone_number: "",
  email: "",
  role_id: null
});

const v$Edit = useVuelidate({
  name: {required},
  phone_number: {required, minLength: 11},
  email: {required, email},
  role_id: {required}
}, formEdit);

const editUser = async () => {
  loading.value = true;
  await v$Edit.value.$validate();

  if (v$Edit.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    await users.editUser(modals.modal.modalData.id, formEdit.value);
    if (users.editedUser) {
      notifications.showNotification("success", "Пользователь успешно отредактирован!", "Пользователь успешно отредактирован, его можно увидеть в списке пользователей.");
      await users.getUserList()
      modals.modal.show = false;
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await users.getRoles()
  formEdit.value.name = modals.modal.modalData.name;
  formEdit.value.phone_number = modals.modal.modalData.phone_number;
  formEdit.value.email = modals.modal.modalData.email;
  formEdit.value.role_id = modals.modal.modalData.role.code;
})
</script>

<template>
  <div>
    <div>
      <p class="font-semibold text-xl mb-5">
        Редактирование пользователя
      </p>
      <p class="text-sm mb-3">
        Заполните все поля для завершения редактирования пользователя.
      </p>
    </div>
    <div
        :class="{ '!border !border-red-500': v$Edit.name.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          for="name"
          class="block text-xs font-medium text-gray-900">
        Имя
      </label>
      <input
          v-model="formEdit.name"
          type="text"
          name="name"
          id="name"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Иван Иванов"
      />
    </div>
    <div
        :class="{ '!border !border-red-500': v$Edit.phone_number.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          for="name"
          class="block text-xs font-medium text-gray-900">
        Номер телефона
      </label>
      <input
          type="text"
          v-model="formEdit.phone_number"
          v-maska
          data-maska="+7 (###) ###-##-##"
          name="phone"
          id="phone"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="+7 (###) ###-##-##"
      />
    </div>
    <div
        :class="{ '!border !border-red-500': v$Edit.email.$error }"
        class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          for="name"
          class="block text-xs font-medium text-gray-900">
        Email
      </label>
      <input
          v-model="formEdit.email"
          type="email"
          name="email"
          id="email"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="example@example.com"
      />
    </div>
    <div class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label
          for="name"
          class="block text-xs font-medium text-gray-900">
        Роль
      </label>
      <select
          v-model="formEdit.role_id"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 bg-white"
          name=""
          id="">
        <option :value="null">Выберите роль</option>
        <option
            v-for="(role, index) in users.rolesList"
            :key="index"
            :value="role.id"
        >
          {{ role.name }}
        </option>
      </select>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="editUser"
      >
        Сохранить
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