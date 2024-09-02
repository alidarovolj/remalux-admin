<script setup>
import {ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {vMaska} from "maska/vue"
import {email, required} from "@vuelidate/validators";
import {useModalsStore} from "@/stores/modals.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useUsersStore} from "@/stores/users.js";

const loading = ref(false);

const modals = useModalsStore()
const notifications = useNotificationStore();
const users = useUsersStore();

const form = ref({
  name: "",
  phone_number: "",
  email: "",
  password: "",
  password_confirmation: ""
});

const v$ = useVuelidate({
  name: {required},
  phone_number: {required, minLength: 11},
  email: {required, email},
  password: {required},
  password_confirmation: {required}
}, form);

const createUser = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  if (form.value.password === form.value.password_confirmation) {
    try {
      await users.createUser(form.value);
      if (users.createdUser) {
        notifications.showNotification("success", "Пользователь успешно создан!", "Пользователь успешно создан, его можно увидеть в списке пользователей.");
        await users.getUserList()
        modals.modal.show = false;
      }
    } catch (e) {
      notifications.showNotification("error", "Произошла ошибка", e);
    } finally {
      loading.value = false;
    }
  } else {
    notifications.showNotification("error", "Ошибка создания пользователя!", "Пароли не совпадают.");
  }
  loading.value = false;
};
</script>

<template>
  <div>
    <div>
      <div>
        <div>
          <p class="font-semibold text-xl mb-5">
            Создание пользователя
          </p>
          <p class="text-sm mb-3">
            Заполните все поля для создания нового пользователя.
          </p>
        </div>
        <div
            :class="{ '!border !border-red-500': v$.name.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Имя
          </label>
          <input
              v-model="form.name"
              type="text"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Иван Иванов"
          />
        </div>
        <div
            :class="{ '!border !border-red-500': v$.phone_number.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Номер телефона
          </label>
          <input
              type="text"
              v-model="form.phone_number"
              v-maska
              data-maska="+7 (###) ###-##-##"
              name="phone"
              id="phone"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="+7 (###) ###-##-##"
          />
        </div>
        <div
            :class="{ '!border !border-red-500': v$.email.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Email
          </label>
          <input
              v-model="form.email"
              type="email"
              name="email"
              id="email"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="example@example.com"
          />
        </div>
        <div
            :class="{ '!border !border-red-500': v$.password.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Пароль
          </label>
          <input
              v-model="form.password"
              type="password"
              name="password"
              id="password"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="••••••••••"
          />
        </div>
        <ul class="list-disc pl-5 mb-5 text-xs">
          <li :class="{ 'text-green-600' : form.password.length >= 8 }">Длина пароля должна быть не менее 8
            символов
          </li>
          <li :class="{ 'text-green-600' : /[A-Z]/.test(form.password) }">Латинские заглавные буквы</li>
          <li :class="{ 'text-green-600' : /[a-z]/.test(form.password) }">Латинские строчные буквы</li>
          <li :class="{ 'text-green-600' : /[0-9]/.test(form.password) }">Цифры 0-9</li>
        </ul>
        <div
            :class="{ '!border !border-red-500': v$.password_confirmation.$error }"
            class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Подтверждение пароля
          </label>
          <input
              v-model="form.password_confirmation"
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="••••••••••"
          />
        </div>
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
              v-if="!loading"
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
              @click="createUser"
          >
            Создать
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
    </div>
  </div>
</template>