<script setup>
import {ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";
import {useNewsStore} from "@/stores/news.js";

const loading = ref(false);

const currentLanguage = ref('ru')

const modals = useModalsStore()
const news = useNewsStore()
const notifications = useNotificationStore()

const form = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  }
});

const v$ = useVuelidate({
  title: {
    ru: {required}
  }
}, form);

const createNews = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    loading.value = false;
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    return;
  }

  try {
    await news.createNewsCategory(form.value);
    if (news.createdNewsCategory) {
      await news.getNewsCategories()
      notifications.showNotification("success", "Новостная категория успешно создана!", "Новостная категория успешно создана, ее можно увидеть в списке новостных категорий.");
      modals.modal.show = false;
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <div>
      <div>
        <div>
          <div>
            <div>
              <p class="font-semibold text-xl mb-5">
                Создание новостной категории
              </p>
              <p class="text-sm mb-3">
                Заполните все поля для создания нового фильтра.
              </p>
            </div>
            <div class="rounded-md px-3 pb-1.5 pt-2.5 border mb-3">
              <div class="flex gap-3 mb-3 text-sm">
                <p
                    @click="currentLanguage = 'ru'"
                    :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'ru' },
                      { '!border !border-red-500': v$.title.ru.$error }
                  ]"
                    class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                  Русский
                </p>
                <p
                    @click="currentLanguage = 'kz'"
                    :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'kz' }
                  ]"
                    class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                  Казахский
                </p>
                <p
                    @click="currentLanguage = 'en'"
                    :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'en' }
                  ]"
                    class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                  Английский
                </p>
              </div>
              <div class="mb-3">
                <div v-if="currentLanguage === 'ru'">
                  <div
                      :class="{ '!border !border-red-500': v$.title.ru.$error }"
                      class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                    <label
                        for="name"
                        class="block text-xs font-medium text-gray-900">
                      Название
                    </label>
                    <input
                        v-model="form.title.ru"
                        type="text"
                        name="name"
                        id="name"
                        class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Название категории"
                    />
                  </div>
                </div>
                <div v-else-if="currentLanguage === 'kz'">
                  <div class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                    <label
                        for="name"
                        class="block text-xs font-medium text-gray-900">
                      Название <span v-if="currentLanguage === 'kz'">(каз)</span>
                    </label>
                    <input
                        v-model="form.title.kz"
                        type="text"
                        name="name"
                        id="name"
                        class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Санат атауы"
                    />
                  </div>
                </div>
                <div v-else>
                  <div class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                    <label
                        for="name"
                        class="block text-xs font-medium text-gray-900">
                      Название <span v-if="currentLanguage === 'en'">(англ)</span>
                    </label>
                    <input
                        v-model="form.title.en"
                        type="text"
                        name="name"
                        id="name"
                        class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Name of category"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                  v-if="!loading"
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                  @click="createNews"
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
    </div>
  </div>
</template>
