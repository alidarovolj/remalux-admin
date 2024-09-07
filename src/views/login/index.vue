<script setup>
import {useVuelidate} from '@vuelidate/core';
import {required} from '@vuelidate/validators';
import {ref} from "vue";
import {api} from "@/utils/axios.js";
import {useNotificationStore} from "@/stores/notifications.js";
import router from "@/router/index.js";
import {useUsersStore} from "@/stores/users.js";

const notifications = useNotificationStore();
const user = useUsersStore()

const form = ref({
  email: null,
  password: null,
});

const v$ = useVuelidate({
  email: {required},
  password: {required},
}, form);

const authorizeUser = async () => {
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Ошибка авторизации!", "Проверьте правильность введенных данных и попробуйте снова.");
    return;
  }

  try {
    await user.authUser(form.value)
    notifications.showNotification("success", "Успешная авторизация!", "Вы успешно авторизовались в системе, дождитесь перенаправления на главную страницу.");
    localStorage.setItem("token", user.authorizedUser.access_token);
    await router.push({name: "Users"});
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  }
}
</script>

<template>
  <div class="min-h-full h-full">
    <div class="flex min-h-full h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-20 w-auto" src="../../assets/img/logos/logo.svg" alt="Logo"/>
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Войдите в свой аккаунт
        </h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="authorizeUser" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email адрес</label>
            <div class="mt-2">
              <input
                  v-model="form.email"
                  :class="{ '!border !border-red-500': v$.email.$error }"
                  id="email"
                  name="email"
                  placeholder="Введите email"
                  type="text"
                  class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Пароль</label>
            </div>
            <div class="mt-2">
              <input
                  v-model="form.password"
                  :class="{ '!border !border-red-500': v$.password.$error }"
                  id="password"
                  placeholder="Введите пароль"
                  name="password"
                  type="password"
                  class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button type="submit"
                    class="flex w-full justify-center rounded-md bg-mainColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Авторизоваться
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
