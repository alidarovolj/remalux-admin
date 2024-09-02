<script setup>
import {nextTick, onMounted, ref} from "vue";
import {TrashIcon} from "@heroicons/vue/24/outline"
import {useVuelidate} from "@vuelidate/core";
import {required, minLength} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";
import {useFiltersStore} from "@/stores/filters.js";
import {storeToRefs} from "pinia";

const notifications = useNotificationStore();
const modals = useModalsStore()
const filters = useFiltersStore()
const {filterDetail} = storeToRefs(filters)
const currentLanguage = ref('ru');

const loading = ref(false);

const formEdit = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  },
  values: []
});

const v$Edit = useVuelidate({
  title: {
    ru: {required},
  },
  values: { required, minLength: minLength(1) }
}, formEdit);

const editFilter = async () => {
  loading.value = true;
  await v$Edit.value.$validate();

  if (v$Edit.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    await filters.editFilter(modals.modal.modalData.id, formEdit.value);
    if (filters.editedFilter) {
      notifications.showNotification("success", "Фильтр успешно отредактирован!", "Фильтр успешно отредактирован, его можно увидеть в списке фильтров.");
      await filters.getFiltersListWithPG()
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
  await filters.getDetailFilter(modals.modal.modalData.id)
  formEdit.value.title = filterDetail.value.title
  filterDetail.value.values.forEach((item) => {
    formEdit.value.values.push(item.values)
  })
  // await filters.getFiltersListWithPG()
})
</script>

<template>
  <div>
    <div>
      <p class="font-semibold text-xl mb-5">
        Редактирование фильтра
      </p>
      <p class="text-sm mb-3">
        Заполните все поля для завершения редактирования фильтра.
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
      <div>
        <div class="flex justify-between mb-2 text-xs">
          <p>Введите значения</p>
          <p
              @click="formEdit.values.push({ ru: '', kz: '', en: '' })"
              class="text-mainColor cursor-pointer">
            Добавить
          </p>
        </div>
        <div
            v-for="(item, index) of formEdit.values"
            :key="index"
            class="flex gap-2 items-center"
            :class="{ 'mb-2' : index !== formEdit.values.length - 1 }">
          <div class="w-full rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <label
                for="name"
                class="block text-xs font-medium text-gray-900">
              Значение <span v-if="currentLanguage === 'kz'">(каз)</span><span
                v-if="currentLanguage === 'en'">(англ)</span>
            </label>
            <input
                v-if="currentLanguage === 'ru'"
                v-model="formEdit.values[index].ru"
                type="text"
                name="name"
                id="name"
                class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Введите значение"
            />
            <input
                v-else-if="currentLanguage === 'kz'"
                v-model="formEdit.values[index].kz"
                type="text"
                name="name"
                id="name"
                class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Мән енгізіңіз"
            />
            <input
                v-else
                v-model="formEdit.values[index].en"
                type="text"
                name="name"
                id="name"
                class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Enter value"
            />
          </div>
          <TrashIcon
              @click="formEdit.values.splice(index, 1)"
              class="w-5 h-5 cursor-pointer text-mainColor"
          />
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="editFilter"
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