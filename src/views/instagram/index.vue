<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useInstagramStore} from "@/stores/instagram.js";
import {storeToRefs} from "pinia";
import TableComponent from "@/components/TableComponent.vue";

const route = useRoute();
const router = useRouter();

const posts = useInstagramStore();
const {list} = storeToRefs(posts);

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "title", type: "string"},
  {name: "Картинка", fn: "image_url", type: "image"},
  {name: "Ссылка", fn: "url", type: "string"},
  {name: "Контент", fn: "content", type: "string"}
]);

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
    await posts.getList();
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await posts.getList(route.query.page, route.query.perPage);
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Instagram
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех постов Instagram
          </p>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="list"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
</template>
