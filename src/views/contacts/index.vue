<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import TableComponent from "@/components/TableComponent.vue";
import {useContactsStore} from "@/stores/contacts.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const contacts = useContactsStore()
const {contactsList} = storeToRefs(contacts)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Город", fn: "city.title.ru", type: "string"},
  {name: "Адрес", fn: "address", type: "string"},
  {name: "Email", fn: "main_email", type: "string"},
  {name: "Телефон", fn: "main_phone", type: "string"}
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
    await contacts.getContacts()
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
            Контакты
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех контактов компании.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <RouterLink
              to="/contacts/create"
              type="button"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить контакт
          </RouterLink>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="contactsList"
          :remove-item="true"
          :edit="true"
          @editValue="(data) => router.push(`/contacts/edit/${data.id}`)"
          @removeItem="(data) => modals.showModal('RemoveContact', data)"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
</template>
