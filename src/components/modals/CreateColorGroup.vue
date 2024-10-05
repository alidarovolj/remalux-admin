<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {storeToRefs} from "pinia";
import {useCategoriesStore} from "@/stores/categories.js";
import {useFiltersStore} from "@/stores/filters.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";
import {useColorsStore} from "@/stores/colors.js";

const route = useRoute();
const router = useRouter();
const loading = ref(false);

const currentLanguage = ref('ru')

const categories = useCategoriesStore()
const modals = useModalsStore()
const filters = useFiltersStore()
const {filtersList} = storeToRefs(filters)
const notifications = useNotificationStore()
const colors = useColorsStore()

const form = ref({
  name: "",
});

const v$ = useVuelidate({
  name: {required}
}, form);

const page = ref(route.query.page || 1);
const perPage = ref(route.query.perPage || 10);

const updateQueryParams = async () => {
  await router.push({query: {...route.query, page: page.value, perPage: perPage.value}});
};

onMounted(async () => {
  await updateQueryParams();
});

watch([page, perPage], updateQueryParams, {deep: true});

const createGroup = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    loading.value = false;
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    return;
  }

  try {
    await colors.createColorGroup(form.value);
    if (colors.createdColorGroup) {
      await colors.getColorGroups()
      notifications.showNotification("success", "Категория успешно создана!", "Категория успешно создана, ее можно увидеть в списке категорий.");
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
                Создание цветовой группы
              </p>
              <p class="text-sm mb-3">
                Заполните все поля для создания новой цветовой группы
              </p>
            </div>
            <div class="rounded-md px-3 pb-1.5 pt-2.5 border mb-3">
              <div>
                <div
                    :class="{ '!border !border-red-500': v$.name.$error }"
                    class="rounded-md">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900">
                    Название
                  </label>
                  <input
                      v-model="form.name"
                      type="text"
                      name="name"
                      id="name"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Название группы"
                  />
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                  v-if="!loading"
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                  @click="createGroup"
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
