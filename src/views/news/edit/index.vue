<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {ArrowLongLeftIcon} from "@heroicons/vue/24/outline/index.js";
import Editor from '@tinymce/tinymce-vue'
import {QuillEditor} from "@vueup/vue-quill";
import UploadImage from "@/components/UploadImage.vue";
import {useNewsStore} from "@/stores/news.js";
import {useNotificationStore} from "@/stores/notifications.js";

const route = useRoute();
const router = useRouter();
const news = useNewsStore()
const loading = ref(false);
const notifications = useNotificationStore()

const currentLanguage = ref('ru')

const form = ref({
  title: {
    ru: "",
    kz: "",
    en: ""
  },
  description: {
    ru: "",
    kz: "",
    en: ""
  },
  image_url: "",
  content: {
    ru: "",
    en: "",
    kz: ""
  },
  category_id: null
});

const options = ref({
  debug: 'info',
  placeholder: 'Экологически чистые и инновационные краски: тенденции 2024 года'
})

const options_kz = ref({
  debug: 'info',
  placeholder: 'Экологиялық таза және инновациялық бояулар: 2024 жылға арналған трендтер'
})

const options_en = ref({
  debug: 'info',
  placeholder: 'Eco-friendly and innovative paints: trends for 2024'
})

const v$ = useVuelidate({
  title: {
    ru: {required},
  },
  description: {
    ru: {required},
  },
  content: {
    ru: {required},
  },
  image_url: {required},
  category_id: {required}
}, form);

const page = ref(route.query.page || 1);
const perPage = ref(route.query.perPage || 10);

const updateQueryParams = async () => {
  await router.push({query: {...route.query, page: page.value, perPage: perPage.value}});
};

onMounted(() => {
  updateQueryParams();
});

watch([page, perPage], updateQueryParams, {deep: true});

const fetchData = async () => {
  try {
    await nextTick()
    await news.getNewsCategories()
    await news.getDetailNews(route.params.id)
    form.value.title = news.detailNews.title
    form.value.content = news.detailNews.content
    form.value.description = news.detailNews.description
    form.value.category_id = news.detailNews.category.id
    form.value.image_url = news.detailNews.image_url
  } catch (error) {
    console.error(error);
  }
};

const editNews = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    await news.editNews(route.params.id, form.value);
    if (news.editedNews !== false) {
      notifications.showNotification("success", "Новость успешно отредактирована!", "Новость успешно отредактирована, ее можно увидеть в списке новостей.");
      await news.getNewsListWithPG();
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div>
        <div>
          <div>
            <div>
              <RouterLink
                  to="/news"
                  class="flex gap-2 items-center mb-5">
                <div>
                  <ArrowLongLeftIcon class="w-5 h-5"/>
                </div>
                <p>
                  Назад
                </p>
              </RouterLink>
              <div class="flex justify-between mb-5">
                <p class="font-semibold text-xl">
                  Редактирование новости
                </p>
                <button
                    type="button"
                    class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                    @click="editNews"
                >
                  Сохранить
                </button>
              </div>
              <p class="text-sm mb-3">
                Заполните все поля для создания новой новости.
              </p>
            </div>
            <UploadImage
                class="mb-3"
                :class="{ '!border-red-500': v$.image_url.$error }"
                type="news"
                :preview_image="form.image_url"
                @photoUploaded="(image) => form.image_url = image"
            />
            <div
                v-if="news.newsCategories"
                :class="{ '!border-red-500': v$.category_id.$error }"
                class="mb-3 text-xs p-3 border rounded-md">
              <p class="block font-medium text-gray-900 mb-2">
                Категория
              </p>
              <select
                  v-model="form.category_id"
                  name=""
                  id=""
                  class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
                <option :value="null">Выберите категорию</option>
                <option
                    v-for="(item, index) of news.newsCategories.data"
                    :key="index"
                    :value="item.id">
                  {{ item.title.ru }}
                </option>
              </select>
            </div>
            <div class="rounded-md px-3 pb-1.5 pt-2.5 border mb-3">
              <div class="flex gap-3 mb-3 text-sm">
                <p
                    @click="currentLanguage = 'ru'"
                    :class="[
                      { 'bg-mainColor text-white': currentLanguage === 'ru' },
                      { '!border !border-red-500': v$.title.ru.$error || v$.description.ru.$error }
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
              <div v-if="currentLanguage === 'ru'">
                <div
                    :class="{ '!border !border-red-500': v$.title.ru.$error }"
                    class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
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
                      placeholder="Новости в мире красок"
                  />
                </div>
                <div
                    :class="{ '!border-red-500': v$.description.ru.$error }"
                    class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      for="name"
                      class="block font-medium text-gray-900 mb-2">
                    Описание
                  </label>
                  <QuillEditor
                      :options="options"
                      v-model:content="form.description.ru"
                      contentType="html"
                  />
                </div>
                <div
                    :class="{ '!border-red-500': v$.content.ru.$error }"
                    class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900 mb-2">
                    Контент
                  </label>
                  <main id="sample">
                    <Editor
                        api-key="wbs5iypxhs4wvkwvvz760zl88zept4h3f91k4cxa8k57uwy4"
                        v-model="form.content.ru"
                        :init="{
        plugins: 'lists link image table code help wordcount'
      }"
                    />
                  </main>
                </div>
              </div>
              <div v-else-if="currentLanguage === 'kz'">
                <div
                    class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900">
                    Название
                  </label>
                  <input
                      v-model="form.title.kz"
                      type="text"
                      name="name"
                      id="name"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Бояулар әлеміндегі жаңалықтар"
                  />
                </div>
                <div class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      for="name"
                      class="block font-medium text-gray-900 mb-2">
                    Описание
                  </label>
                  <QuillEditor
                      :options="options_kz"
                      v-model:content="form.description.kz"
                      contentType="html"
                  />
                </div>
                <div class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900 mb-2">
                    Контент
                  </label>
                  <main id="sample">
                    <Editor
                        api-key="wbs5iypxhs4wvkwvvz760zl88zept4h3f91k4cxa8k57uwy4"
                        v-model="form.content.kz"
                        :init="{
        plugins: 'lists link image table code help wordcount'
      }"
                    />
                  </main>
                </div>
              </div>
              <div v-else>
                <div
                    class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900">
                    Название
                  </label>
                  <input
                      v-model="form.title.en"
                      type="text"
                      name="name"
                      id="name"
                      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="News in the world of paints"
                  />
                </div>
                <div class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      for="name"
                      class="block font-medium text-gray-900 mb-2">
                    Описание
                  </label>
                  <QuillEditor
                      :options="options_en"
                      v-model:content="form.description.en"
                      contentType="html"
                  />
                </div>

                <div class="mb-3 text-xs p-3 border rounded-md">
                  <label
                      for="name"
                      class="block text-xs font-medium text-gray-900 mb-2">
                    Контент
                  </label>
                  <main id="sample">
                    <Editor
                        api-key="wbs5iypxhs4wvkwvvz760zl88zept4h3f91k4cxa8k57uwy4"
                        v-model="form.content.en"
                        :init="{
        plugins: 'lists link image table code help wordcount'
      }"
                    />
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
