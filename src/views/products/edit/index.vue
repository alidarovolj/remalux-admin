<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useProductsStore} from "@/stores/products.js";
import {storeToRefs} from "pinia";
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {ArrowLongLeftIcon, CheckIcon, ChevronUpDownIcon, XMarkIcon} from "@heroicons/vue/24/outline/index.js";
import {useCategoriesStore} from "@/stores/categories.js";
import {useFiltersStore} from "@/stores/filters.js";
import UploadImage from "@/components/UploadImage.vue";
import {useNotificationStore} from "@/stores/notifications.js";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from "@headlessui/vue";

const route = useRoute();
const router = useRouter();

const selected = ref(null)

const updateRelatedProducts = (product) => {
  if (product && !form.value.related_product_ids.includes(product.id)) {
    form.value.related_product_ids.push(product.id);
  }
};

// Remove related product
const removeRelatedProduct = (index) => {
  form.value.related_product_ids.splice(index, 1);
};

// Helper to get the product name by ID
const getProductNameById = (id) => {
  console.log("Related product ID:", id); // Debugging the product ID from related_product_ids

  // Log all fetched product IDs to verify they're in the right format
  console.log("Fetched products:", products.productsList?.data.map(p => p.id));

  const product = products.productsList?.data?.find(p => p.id == id); // Note the '==' to allow type coercion between string and number

  if (product) {
    console.log("Product found:", product.title.ru); // Debugging
    return product.title.ru;
  } else {
    console.log("Product not found for ID:", id); // Debugging
    return 'Unknown Product';
  }
};



const newElementsForm = ref([])
const newElementForm = ref({
  filter_id: null,
  value: {
    ru: "",
    kz: "",
    en: ""
  },
  values: []
})

const newVariant = ref(null)

const currentLanguage = ref('ru')

const products = useProductsStore()
const categories = useCategoriesStore()
const {categoriesList} = storeToRefs(categories)
const filters = useFiltersStore()
const {filtersListByCategory} = storeToRefs(filters)
const notifications = useNotificationStore()

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
  article: "",
  category_id: null,
  image_url: "",
  product_variants: [],
  filter_data: [],
  related_product_ids: []
});

const v$ = useVuelidate({
  title: {
    ru: {required},
  },
  description: {
    ru: {required},
  },
  article: {required},
  category_id: {required},
  image_url: {required},
  filter_data: {required, minLength: (1)}
}, form);

const options = ref({
  debug: 'info',
  placeholder: 'Акриловая водно-дисперсионная краска предназначенная для окрашивания интерьеров и фасадов...'
})

const options_kz = ref({
  debug: 'info',
  placeholder: 'Интерьер мен қасбеттерді бояуға арналған акрилді су-дисперсиялық бояу...'
})

const options_en = ref({
  debug: 'info',
  placeholder: 'Acrylic water-dispersion paint intended for painting interiors and facades...'
})

const newElement = (index) => {
  form.value.filter_data.push({
    filter_id: newElementsForm.value[index].filter_id,
    value: newElementsForm.value[index].value
  })
  newElementsForm.value[index].value = {
    ru: "",
    kz: "",
    en: ""
  }
}

const page = ref(route.query.page || 1);
const perPage = ref(route.query.perPage || 10);

const updateQueryParams = async () => {
  await router.push({query: {...route.query, page: page.value, perPage: perPage.value}});
};

onMounted(() => {
  updateQueryParams();
});

watch([page, perPage], updateQueryParams, {deep: true});

const getFilterTitleById = (filterId) => {
  const filter = filtersListByCategory.value.find(filter => filter.id === filterId);
  return filter ? filter.title : 'Unknown Filter';
};

const editProduct = async () => {
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    return;
  }

  try {
    await products.editProduct(route.params.id, form.value);
    if (products.editedProduct) {
      notifications.showNotification("success", "Продукт успешно создан!", "Продукт успешно создан, его можно увидеть в списке продуктов.");
      await router.push('/products')
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
};

const fetchData = async () => {
  try {
    await products.detailProduct(route.params.id);
    form.value.title = products.detailProductResult.title;
    form.value.description = products.detailProductResult.description;
    form.value.image_url = products.detailProductResult.image_url;
    products.detailProductResult.product_variants.forEach(variant => {
      form.value.product_variants.push(variant.value);
    });
    form.value.category_id = products.detailProductResult.category.id;
    form.value.article = products.detailProductResult.article;
    products.detailProductResult.related_products.forEach(product => {
      form.value.related_product_ids.push(product.id);
    });
    await nextTick()
    // Get filters by category
    await filters.getFiltersListByCategory(form.value.category_id);
    newElementsForm.value = [];
    filters.filtersListByCategory.forEach(filter => {
      const elementCopy = JSON.parse(JSON.stringify(newElementForm.value));
      elementCopy.filter_id = filter.id;
      newElementsForm.value.push(elementCopy);
    });
    products.detailProductResult.filter_data.forEach(filter => {
      let elem = {}
      elem.filter_id = filter.id;
      elem.value_id = filter.value_id;
      elem.value = filter.value;
      form.value.filter_data.push(elem);
    });
    await nextTick()
    await categories.getCategoriesList()
    await filters.getFiltersListByCategory(form.value.category_id);
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(() => form.value.category_id, async () => {
  console.log("category_id changed")
  await filters.getFiltersListByCategory(form.value.category_id);
  newElementsForm.value = [];
  filters.filtersListByCategory.forEach(filter => {
    const elementCopy = JSON.parse(JSON.stringify(newElementForm.value));
    elementCopy.filter_id = filter.id;
    newElementsForm.value.push(elementCopy);
  });
  form.value.filter_data = []
  await setQuery({target: {value: ''}}, 0)
}, {deep: true});

const setQuery = async (event, index) => {
  newElementsForm.value[index].query = event.target.value;
  await filters.getFilterValues(newElementsForm.value[index].filter_id, event.target.value)
  newElementsForm.value[index].values = filters.filterValues.data
};

const selectFilter = (index, value) => {
  // Ensure that the filter_id and value_id are updated correctly
  const newElement = {
    filter_id: newElementsForm.value[index].filter_id,
    value_id: value.id,
    value: newElementsForm.value[index].value.values
  };

  // Add the new element to form.filter_data if it does not already exist
  const exists = form.value.filter_data.some(
      (item) => item.filter_id === newElement.filter_id && item.value_id === newElement.value_id
  );

  if (!exists) {
    form.value.filter_data.push(newElement);
  }
};

onMounted(async () => {
  await nextTick();
  await products.getProductsList();
  console.log("Products List:", products.productsList); // Debugging
});

</script>

<template>
  <div>
    <div
        v-if="products.detailProductResult"
        class="px-4 sm:px-6 lg:px-8">
      <div>
        <div>
          <div>
            <div>
              <RouterLink
                  to="/products"
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
                  Редактирование продукта
                </p>
                <button
                    type="button"
                    class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                    @click="editProduct"
                >
                  Сохранить
                </button>
              </div>
              <p class="text-sm mb-3">
                Заполните все поля для успешного редактирования продукта.
              </p>
            </div>
            <div
                :class="{ '!border !border-red-500': v$.article.$error }"
                class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                  for="name"
                  class="block text-xs font-medium text-gray-900">
                Артикул
              </label>
              <div class="flex gap-2">
                <input
                    v-model="form.article"
                    type="text"
                    name="name"
                    id="name"
                    class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="1XE3241F"
                />
              </div>
            </div>
            <div
                class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                  for="related-products"
                  class="block text-xs font-medium text-gray-900">
                С этим товаром покупают
              </label>
              <Listbox
                  as="div"
                  v-model="selected"
                  @update:modelValue="updateRelatedProducts">
                <div class="relative mt-2">
                  <ListboxButton
                      class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                <span class="flex items-center">
                  <span class="ml-3 block truncate">{{ selected?.name || 'Выберите товар' }}</span>
                </span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                </span>
                  </ListboxButton>

                  <transition
                      leave-active-class="transition ease-in duration-100"
                      leave-from-class="opacity-100"
                      leave-to-class="opacity-0">
                    <ListboxOptions
                        class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ListboxOption
                          as="template"
                          v-for="(item, index) in products.productsList?.data"
                          :key="item.id"
                          :value="item"
                          v-slot="{ active, selected }">
                        <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                          <div class="flex items-center">
                            <img :src="item.image_url" alt="" class="h-5 w-5 flex-shrink-0 rounded-full"/>
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">
                          {{ item.title.ru }}
                        </span>
                          </div>

                          <span v-if="selected"
                                :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                        <CheckIcon class="h-5 w-5" aria-hidden="true"/>
                      </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>

            <!-- Display selected related products -->
            <div v-if="products.productsList?.data && products.productsList?.data.length > 0">
              <div v-if="form.related_product_ids.length > 0" class="my-3 text-xs">
                <p class="block font-medium text-gray-900">Выбранные товары</p>
                <div class="flex flex-wrap gap-2">
                  <div
                      v-for="(productId, ind) of form.related_product_ids"
                      :key="ind"
                      class="flex items-center bg-gray-100 p-2 gap-1 rounded-md">
                    <p>{{ getProductNameById(productId) }}</p>
                    <XMarkIcon
                        @click="removeRelatedProduct(ind)"
                        class="w-5 h-5 text-red-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
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
                      placeholder="Универсальная краска матовая"
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
                      placeholder="Күңгірт әмбебап бояу"
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
                      placeholder="Universal paint matte"
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
              </div>
            </div>
            <div class="mb-3">
              <UploadImage
                  :class="{ '!border !border-red-500': v$.image_url.$error }"
                  type="products"
                  :preview_image="form.image_url"
                  @photoUploaded="(image) => form.image_url = image"
              />
            </div>
            <div
                class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                  for="name"
                  class="block text-xs font-medium text-gray-900">
                Доступный вес
              </label>
              <div class="flex gap-2">
                <input
                    v-model="newVariant"
                    type="number"
                    name="name"
                    id="name"
                    class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="10кг"
                />
                <button
                    v-if="newVariant"
                    @click="form.product_variants.push(newVariant.toString()); newVariant = null;"
                    type="button"
                    class="rounded bg-mainColor px-2 py-1 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                  Добавить
                </button>
              </div>
            </div>
            <div v-if="form.product_variants.length > 0" class="my-3 text-xs">
              <p class="block font-medium text-gray-900">
                Доступные веса
              </p>
              <div class="flex flex-wrap gap-2">
                <div
                    v-for="(weight, ind) of form.product_variants"
                    :key="ind"
                    class="flex items-center bg-gray-100 p-2 gap-1 rounded-md">
                  <p>
                    {{ weight }}кг
                  </p>
                  <XMarkIcon
                      @click="form.product_variants.splice(ind, 1)"
                      class="w-5 h-5 text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div v-if="categoriesList" class="mb-3">
              <p class="block text-xs font-medium text-gray-900">
                Категория
              </p>
              <select
                  v-model="form.category_id"
                  class="w-full p-2 rounded-md text-xs border"
                  name=""
                  id="">
                <option :value="null">Выберите категорию</option>
                <option
                    v-for="(item, index) of categoriesList.data"
                    :key="index"
                    :value="item.id"
                >
                  {{ item.title.ru }}
                </option>
              </select>
            </div>
            <div v-if="filtersListByCategory">
              <div
                  v-if="filtersListByCategory.length > 0 && newElementsForm.length > 0"
                  class="text-xs mb-3">
                <p class="block text-xs font-medium text-gray-900 mb-2">
                  Выберите фильтры для продукта
                </p>
                <div class="lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                  <div
                      v-for="(item, index) of filtersListByCategory"
                      :key="index"
                      class="flex items-center w-full"
                  >
                    <div class="w-full">
                      <div class="flex justify-between">
                        <p>
                          {{ item.title.ru }}
                        </p>
                      </div>
                      <div class="flex items-center gap-2 w-full">
                        <Combobox
                            as="div"
                            class="w-full"
                            v-model="newElementsForm[index].value"
                            @update:modelValue="(value) => selectFilter(index, value)"
                        >
                          <ComboboxLabel class="block text-xs font-medium leading-3 text-gray-900">
                            {{ newElementsForm[index].values.ru }}
                          </ComboboxLabel>
                          <div class="relative mt-2">
                            <ComboboxInput
                                :class="{ '!border !border-red-500': v$.filter_data.$error }"
                                class="w-full rounded-md border-0 bg-white py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                @change="setQuery($event, index)"
                                @blur="newElementsForm[index].query = ''"
                                :display-value="(value) => value?.values?.ru"
                            />
                            <ComboboxButton
                                class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
                            >
                              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </ComboboxButton>

                            <ComboboxOptions
                                v-if="newElementsForm[index].values.length > 0"
                                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                            >
                              <ComboboxOption
                                  v-for="(filter, ind) in newElementsForm[index].values"
                                  :key="ind"
                                  :value="filter"
                                  as="template"
                                  v-slot="{ active, selected }"
                              >
                                <li
                                    :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-900']"
                                >
                  <span :class="['block truncate', selected && 'font-semibold']">
                    {{ filter.values.ru }}
                  </span>
                                  <span
                                      v-if="selected"
                                      :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600']"
                                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true"/>
                  </span>
                                </li>
                              </ComboboxOption>
                            </ComboboxOptions>
                          </div>
                        </Combobox>
                      </div>
                    </div>
                  </div>
                </div>


                <div v-if="form.filter_data.length > 0" class="mt-3">
                  <p class="block text-xs font-medium text-gray-900">
                    Выбранные фильтры
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <div
                        v-for="(filter, ind) of form.filter_data"
                        :key="ind"
                        class="flex items-center bg-gray-100 p-2 gap-1 rounded-md">
                      <p>
                        {{ getFilterTitleById(filter.filter_id).ru }}:
                      </p>
                      <p>
                        {{ filter.value.ru }}<span v-if="filter.value.kz">, {{ filter.value.kz }}</span><span
                          v-if="filter.value.en">, {{ filter.value.en }}</span>
                      </p>
                      <XMarkIcon
                          @click="form.filter_data.splice(ind, 1)"
                          class="w-5 h-5 text-red-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
