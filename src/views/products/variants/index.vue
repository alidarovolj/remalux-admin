<script setup>
import {ref, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import TableComponent from "@/components/TableComponent.vue";
import {useProductsStore} from "@/stores/products.js";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const products = useProductsStore()
const {productVariantsList} = storeToRefs(products)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "product.title.ru", type: "string"},
  {name: "Вес (кг.)", fn: "value", type: "string"},
  {name: "Количество", fn: "quantity", type: "string"},
  {name: "Оптовая цена", fn: "prices.wholesale", type: "string"},
  {name: "Розничная цена", fn: "prices.retail", type: "string"},
])

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
    await products.getProductVariantsList()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await products.getProductVariantsList(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Вариации продуктов
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех вариаций продуктов вашей компании, включая их названия, описания и категории.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 flex gap-3">
          <div class="flex items-center gap-1 rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            <img class="w-7 h-7" src="@/assets/img/logos/excel.png" alt="">
            <p>
              Скачать
            </p>
          </div>
          <div class="flex items-center rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Импортировать
          </div>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="productVariantsList"
          :change-price="true"
          :search="true"
          :change-remains="true"
          @call_to_refresh="fetchData"
          @changePrice="(data) => modals.showModal('ChangePrice', data)"
          @changeRemains="(data) => modals.showModal('ChangeRemains', data)"
      />
    </div>
  </div>
</template>
