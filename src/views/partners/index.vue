<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import TableComponent from "@/components/TableComponent.vue";
import {useOrdersStore} from "@/stores/orders.js";
import {usePartnersStore} from "@/stores/partners.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const partners = usePartnersStore()
const {partnersList} = storeToRefs(partners)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "name", type: "string"},
  {name: "Номер телефона", fn: "phone_number", type: "string"},
  {name: "БИН", fn: "bin", type: "string"},
  {name: "Email", fn: "email", type: "string"},
  {name: "Город", fn: "city.title.ru", type: "string"},
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
    await partners.getPartners()
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
            Партнеры
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех партнеров
          </p>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="partnersList"
          @call_to_refresh="fetchData"
      >
      </TableComponent>

    </div>
  </div>
</template>
