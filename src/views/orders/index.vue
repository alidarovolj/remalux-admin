<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import TableComponent from "@/components/TableComponent.vue";
import {useOrdersStore} from "@/stores/orders.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const orders = useOrdersStore()
const {ordersList} = storeToRefs(orders)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Продукты", fn: "order_items", type: "product_array"},
  {name: "Оплачен", fn: "is_paid", type: "boolean"},
  {name: "Статус", fn: "status", type: "borders"},
  {name: "Цена", fn: "total_amount", type: "string"}
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
    await orders.getOrders()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Заказы
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех заказов компании.
          </p>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="ordersList"
          link="orders"
          :update-order-status="true"
          :update-order-payment="true"
          @call_to_refresh="fetchData"
          @updateOrderStatus="(data) => modals.showModal('UpdateOrderStatus', data)"
          @updateOrderPayment="(data) => modals.showModal('UpdateOrderPayment', data)"
      >
      </TableComponent>

    </div>
  </div>
</template>
