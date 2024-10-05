<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import TableComponent from "@/components/TableComponent.vue";
import {useContactsStore} from "@/stores/contacts.js";
import {useColorsStore} from "@/stores/colors.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const colors = useColorsStore()
const {colorsList} = storeToRefs(colors)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "title.ru", type: "string"},
  {name: "HEX код", fn: "hex", type: "string"},
  {name: "Род. цвет", fn: "parent_color.title", type: "string"},
  {name: "Ral", fn: "ral", type: "string"},
  {name: "Каталог", fn: "catalog.title", type: "string"},
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
    await colors.getColors()
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
            Цвета
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех цветов в системе
          </p>
        </div>
<!--        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">-->
<!--          <RouterLink-->
<!--              to="/contacts/create"-->
<!--              type="button"-->
<!--              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">-->
<!--            Добавить контакт-->
<!--          </RouterLink>-->
<!--        </div>-->
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="colorsList"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
</template>
