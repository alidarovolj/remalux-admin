<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import TableComponent from "@/components/TableComponent.vue";
import {useNewsStore} from "@/stores/news.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const news = useNewsStore()
const {newsSubscribers} = storeToRefs(news)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "title.ru", type: "string"},
  {name: "Категория", fn: "category.ru", type: "string"},
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
    await news.getNewsSubscribers()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await news.getNewsSubscribers(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Подписчики на рассылку
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех подписчиков на рассылку новостей
          </p>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="newsSubscribers"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
</template>
