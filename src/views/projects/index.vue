<script setup>
import {ref, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import TableComponent from "@/components/TableComponent.vue";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import {useProjectsStore} from "@/stores/projects.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const projects = useProjectsStore()
const {projectsList} = storeToRefs(projects)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "title.ru", type: "string"},
  {name: "Описание", fn: "description.ru", type: "string"},
  {name: "Картинка", fn: "images", type: "images_array"},
  {name: "Дата создания", fn: "created_at", type: "time"},
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
    await projects.getProjects()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await projects.getProjects(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Проекты
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех проектов вашей компании, включая их названия, описания и категории.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              @click="modals.showModal('CreateProject')"
              type="button"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить проект
          </button>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="projectsList"
          :search="true"
          @call_to_refresh="fetchData"
          :remove-item="true"
          :edit="true"
          @removeItem="(data) => modals.showModal('RemoveProject', data)"
          @editValue="(data) => modals.showModal('EditProject', data)"
      />
    </div>
  </div>
</template>
