<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import {useIdeasStore} from "@/stores/ideas.js";
import TableComponent from "@/components/TableComponent.vue";
import {useDiscountStore} from "@/stores/discounts.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const discounts = useDiscountStore()
const {discountList} = storeToRefs(discounts)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "title", type: "string"},
  {name: "Значение", fn: "value", type: "string"},
  {name: "Продукт", fn: "product_variant.title", type: "string"},
  {name: "Выставлено для", fn: "user.name", type: "string"},
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
    await discounts.getDiscountList()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await discounts.getDiscountList(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Скидки
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех скидок вашей продукции
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              @click="modals.showModal('CreateDiscount')"
              type="button"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить скидку
          </button>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="discountList"
          @call_to_refresh="fetchData"
          :edit="true"
          :remove-item="true"
          @editValue="(data) => modals.showModal('EditDiscount', data)"
          @removeItem="(data) => modals.showModal('RemoveDiscount', data)"
      />
    </div>
  </div>
</template>
