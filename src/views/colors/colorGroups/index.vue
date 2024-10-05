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
const {colorGroupList} = storeToRefs(colors)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Название", fn: "name", type: "string"},
  {name: "Цвета", fn: "colors", type: "color_array"}
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
    await colors.getColorGroups()
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
            Цветовые группы
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех цветовых групп в системе
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <p
              @click="modals.showModal('CreateColorGroup')"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить группу
          </p>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="colorGroupList"
          @call_to_refresh="fetchData"
          :addElement="true"
          :edit="true"
          :remove-item="true"
          @editValue="(data) => modals.showModal('EditColorGroup', data)"
          @removeItem="(data) => modals.showModal('RemoveColorGroup', data)"
          @addElement="(data) => modals.showModal('AddColorToColorGroup', data)"
      />
    </div>
  </div>
</template>
