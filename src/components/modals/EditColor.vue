<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";
import {useCategoriesStore} from "@/stores/categories.js";
import UploadImage from "@/components/UploadImage.vue";
import {useFiltersStore} from "@/stores/filters.js";
import {storeToRefs} from "pinia";
import {useColorsStore} from "@/stores/colors.js";

const notifications = useNotificationStore();
const modals = useModalsStore()
const currentLanguage = ref('ru');
const colors = useColorsStore()

const loading = ref(false);

const formEdit = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  },
  hex: "",
  ral: "",
  color_catalog_id: null,
  parent_color_id: null
});

const v$Edit = useVuelidate({
  title: {
    ru: {required},
    kz: {required},
    en: {required}
  },
  hex: {required},
  ral: {required},
  color_catalog_id: {required},
  parent_color_id: {required}
}, formEdit);

const editColor = async () => {
  loading.value = true;
  await v$Edit.value.$validate();

  if (v$Edit.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    await colors.editColor(modals.modal.modalData.id, formEdit.value);
    if (colors.editedColor) {
      notifications.showNotification("success", "Успешно", "Краска успешно отредактирована");
      await colors.getColors()
      modals.modal.show = false;
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await nextTick()
  formEdit.value.title = modals.modal.modalData.title;
  formEdit.value.hex = modals.modal.modalData.hex;
  formEdit.value.ral = modals.modal.modalData.ral;
  formEdit.value.color_catalog_id = modals.modal.modalData.catalog.id;
  formEdit.value.parent_color_id = modals.modal.modalData.parent_color.id;
  await colors.getColors()
})
</script>

<template>
  <div>
    <div>
      <p class="font-semibold text-xl mb-5">
        Редактирование цвета
      </p>
      <p class="text-sm mb-3">
        Заполните все поля для редактирования цвета.
      </p>
    </div>
    <div class="rounded-md px-3 pb-1.5 pt-2.5 border mb-3">
      <div class="flex gap-3 mb-3 text-sm">
        <p
            @click="currentLanguage = 'ru'"
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'ru' },
                      { '!border !border-red-500': v$Edit.title.ru.$error }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
          Русский
        </p>
        <p
            @click="currentLanguage = 'kz'"
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'kz' },
                      { '!border !border-red-500': v$Edit.title.kz.$error }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
          Казахский
        </p>
        <p
            @click="currentLanguage = 'en'"
            :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'en' },
                      { '!border !border-red-500': v$Edit.title.en.$error }
                  ]"
            class="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
          Английский
        </p>
      </div>
      <div v-if="currentLanguage === 'ru'">
        <div
            :class="{ '!border !border-red-500': v$Edit.title.ru.$error }"
            class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Название
          </label>
          <input
              v-model="formEdit.title.ru"
              type="text"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Название категории"
          />
        </div>
      </div>
      <div v-else-if="currentLanguage === 'kz'">
        <div
            :class="{ '!border !border-red-500': v$Edit.title.kz.$error }"
            class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Название
          </label>
          <input
              v-model="formEdit.title.kz"
              type="text"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Санат атауы"
          />
        </div>
      </div>
      <div v-else>
        <div
            :class="{ '!border !border-red-500': v$Edit.title.en.$error }"
            class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Название
          </label>
          <input
              v-model="formEdit.title.en"
              type="text"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Name of category"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div
          :class="{ '!border !border-red-500': v$Edit.hex.$error }"
          class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
          :style="`background: ${formEdit.hex};`"
      >
        <label
            for="name"
            class="block text-xs font-medium text-gray-900">
          Hex
        </label>
        <input
            :style="`background: ${formEdit.hex};`"
            v-model="formEdit.hex"
            type="text"
            name="name"
            id="name"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Введите HEX код"
        />
      </div>
      <div
          :class="{ '!border !border-red-500': v$Edit.ral.$error }"
          class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <label
            for="name"
            class="block text-xs font-medium text-gray-900">
          RAL
        </label>
        <input
            v-model="formEdit.ral"
            type="text"
            name="name"
            id="name"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Введите RAL"
        />
      </div>
      <div
          :class="{ '!border !border-red-500': v$Edit.color_catalog_id.$error }"
          class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <label
            for="name"
            class="block text-xs font-medium text-gray-900">
          Каталог
        </label>
        <select name="" id="" v-model="formEdit.color_catalog_id" class="w-full">
          <option :value="null">Выберите каталог</option>
          <option :value="1">Мониклор Нова 2024</option>
        </select>
      </div>
      <div
          :class="{ '!border !border-red-500': v$Edit.parent_color_id.$error }"
          class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <label
            for="name"
            class="block text-xs font-medium text-gray-900">
          Родительский цвет
        </label>
        <select name="" id="" v-model="formEdit.parent_color_id" class="w-full">
          <option :value="null">Выберите цвет</option>
          <option
              v-for="(item, index) of colors.colorsList.data"
              :key="index"
              :value="1">
            {{ item.title.ru }}
          </option>
        </select>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="editColor"
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