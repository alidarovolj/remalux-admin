<script setup>
import {ArrowLongLeftIcon, XMarkIcon} from "@heroicons/vue/24/outline/index.js";
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";
import {useColorsStore} from "@/stores/colors.js";
import UploadColors from "@/components/UploadColors.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchColor = ref('');
const showColorPicker = ref(false);
const colorPickerContainer = ref(null);
const arrayOfColors = ref([]);

const modals = useModalsStore();
const notifications = useNotificationStore();
const colors = useColorsStore();

const form = ref({
  color_ids: [],
});

const page = ref(route.query.page || 1);
const perPage = ref(route.query.perPage || 10);

const updateQueryParams = async () => {
  await router.push({query: {...route.query, page: page.value, perPage: perPage.value}});
};

onMounted(async () => {
  await colors.getDetailColorGroup(route.params.id);
  await updateQueryParams();
});

const removeColorFromGroup = async (id) => {
  loading.value = true;

  try {
    await colors.removeColorGroupColor(route.params.id, id);
    if (colors.removedColorGroupColor) {
      await colors.getDetailColorGroup(route.params.id);
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
};

watch([page, perPage], updateQueryParams, {deep: true});

const updateGroup = async () => {
  loading.value = true;

  try {
    await colors.addToColorGroup(route.params.id, form.value);
    if (colors.addedToColorGroup) {
      await colors.getColorGroups();
      notifications.showNotification("success", "Успешно", "Цвета успешно добавлены в группу");
      router.push('/color-groups');
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await nextTick();
  await colors.getDetailColorGroup(route.params.id);
});

const handleClickOutside = (event) => {
  if (colorPickerContainer.value && !colorPickerContainer.value.contains(event.target)) {
    showColorPicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>


<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div>
      <RouterLink
          to="/color-groups"
          class="flex gap-2 items-center mb-5">
        <div>
          <ArrowLongLeftIcon class="w-5 h-5"/>
        </div>
        <p>
          Назад
        </p>
      </RouterLink>
      <div class="flex items-center justify-between mb-5">
        <p class="font-semibold text-xl">
          Добавление цвета для цветовой группы <span class="text-mainColor">{{
            colors.detailColorGroup?.data?.name
          }}</span>
        </p>
        <div class="flex gap-3">
          <UploadColors/>
          <button
              type="button"
              class="inline-flex w-max justify-center items-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
              @click="updateGroup"
          >
            Сохранить
          </button>
        </div>
      </div>
      <p class="text-lg mb-3">
        Добавьте цвет для цветовой группы
      </p>
      <div>

        <div class="text-xs">
          <div ref="colorPickerContainer">
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
                      @click="arrayOfColors.push(item); form.color_ids.push(item.id);"
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
          <div
              class="mt-2">
            <p class="mb-3 text-lg">
              Цвета в группе
            </p>
            <div class="flex flex-row flex-wrap gap-2">
              <div
                  v-for="(item, index) of colors.detailColorGroup?.data?.colors"
                  :key="index"
                  class="px-3 py-1 rounded-md text-base flex items-center justify-between gap-2"
                  :style="{ backgroundColor: item.hex }"
              >
                <p>{{ item.title.ru }}</p>
                <XMarkIcon
                    @click="removeColorFromGroup(item.id)"
                    class="w-5 h-5 cursor-pointer text-red-500"
                />
              </div>
            </div>
          </div>
          <div
              v-if="arrayOfColors.length > 0"
              class="mt-5">
            <p class="mb-3 text-lg">
              Новые цвета
            </p>
            <div class="flex flex-row flex-wrap gap-2">
              <div
                  v-for="(item, index) of arrayOfColors"
                  :key="index"
                  class="px-3 py-1 rounded-md text-base flex items-center justify-between gap-2"
                  :style="{ backgroundColor: item.hex }"
              >
                <p>{{ item.title.ru }}</p>
                <XMarkIcon
                    @click="arrayOfColors.splice(index, 1); form.color_ids.splice(index, 1)"
                    class="w-5 h-5 cursor-pointer text-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>