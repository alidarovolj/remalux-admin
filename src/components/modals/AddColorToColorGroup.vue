<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";
import {useColorsStore} from "@/stores/colors.js";
import {XMarkIcon} from "@heroicons/vue/24/outline/index.js";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchColor = ref('')
const showColorPicker = ref(false)
const colorPickerContainer = ref(null);
const arrayOfColors = ref([])

const modals = useModalsStore()
const notifications = useNotificationStore()
const colors = useColorsStore()

const form = ref({
  color_ids: [],
});

const page = ref(route.query.page || 1);
const perPage = ref(route.query.perPage || 10);

const updateQueryParams = async () => {
  await router.push({query: {...route.query, page: page.value, perPage: perPage.value}});
};

onMounted(async () => {
  await updateQueryParams();
});

watch([page, perPage], updateQueryParams, {deep: true});

const updateGroup = async () => {
  loading.value = true;

  try {
    await colors.addToColorGroup(modals.modal.modalData.id, form.value)
    if (colors.addedToColorGroup) {
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

onMounted(async () => {
  await nextTick()
  await colors.getDetailColorGroup(modals.modal.modalData.id)
})
</script>

<template>
  <div>
    <div>
      <div>
        <div>
          <div>
            <div class="mb-5">
              <p class="font-semibold text-xl mb-5">
                Добавление цвета в группу
              </p>
              <p class="text-sm mb-3">
                Добавление цвета в группу позволяет легко управлять цветами в системе.
              </p>
            </div>

            <div class="text-xs">
              <div ref="colorPickerContainer">
                <p class="mb-1">Выберите рекомендованные цвета</p>
                <p class="mb-1 text-red-500">Для поиска по HEX коду, пожалуйста, вводите значение большими буквами</p>
                <div class="relative">
                  <input
                      v-model="searchColor"
                      @input="colors.getColors(searchColor)"
                      @focus="showColorPicker = true"
                      placeholder="Введите hex код цвета или название цвета"
                      class="border px-5 py-2 rounded-md text-xs mb-3 w-full"
                      type="text"
                  >
                  <div
                      v-if="showColorPicker && colors.colorsList"
                      class="absolute top-full left-0 w-full bg-white z-50 shadow-xl"
                  >
                    <div v-if="colors.colorsList.data.length > 0">
                      <div
                          v-for="(item, index) of colors.colorsList.data"
                          :key="index"
                          @click="arrayOfColors.push(item); form.color_ids.push(item.id); showColorPicker = false"
                          class="flex gap-2 p-2 cursor-pointer hover:bg-gray-100 transition-all"
                      >
                        <div class="w-3 h-3" :style="{ backgroundColor: item.hex }"></div>
                        <p>{{ item.title.ru }}</p>
                      </div>
                    </div>
                    <p v-else>Результаты не найдены</p>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap gap-3 mt-2">
                <div
                    v-for="(item, index) of arrayOfColors"
                    :key="index"
                    class="px-3 py-1 rounded-md text-xs flex items-center gap-2"
                    :style="{ backgroundColor: item.hex }"
                >
                  <p>{{ item.title.ru }}</p>
                  <XMarkIcon
                      @click="arrayOfColors.splice(index, 1); form.color_ids.splice(index, 1)"
                      class="w-5 h-5 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                  v-if="!loading"
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                  @click="updateGroup"
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
        </div>
      </div>
    </div>
  </div>
</template>
