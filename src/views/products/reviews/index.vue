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
const {productsReviews} = storeToRefs(products)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Продукт", fn: "product.name", type: "string"},
  {name: "Комментарий", fn: "comment", type: "string"},
  {name: "Рейтинг", fn: "rating", type: "string"},
  {name: "Пользователь", fn: "user.name", type: "string"},
  {name: "Картинки", fn: "images", type: "images_array_2"},
  {name: "Статус", fn: "is_verified", type: "boolean"}
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
    await products.getReviewsList()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await products.getReviewsList(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Отзывы по продуктам
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            В данном разделе вы можете просмотреть отзывы по продуктам и управлять ими.
          </p>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="productsReviews"
          :search="true"
          :edit="true"
          @editValue="(data) => modals.showModal('VerifyReview', data)"
      />
    </div>
  </div>
</template>
