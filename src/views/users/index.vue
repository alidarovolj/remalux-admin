<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUsersStore} from "@/stores/users.js";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import TableComponent from "@/components/TableComponent.vue";

const route = useRoute();
const router = useRouter();

const users = useUsersStore();
const {userList} = storeToRefs(users);

const modals = useModalsStore()

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Имя", fn: "name", type: "string"},
  {name: "Email", fn: "email", type: "string"},
  {name: "Номер телефона", fn: "phone_number", type: "string"},
  {name: "Роль", fn: "role.name", type: "string"}
]);

const page = ref(route.query.page || 1);
const perPage = ref(route.query.perPage || 10);

const updateQueryParams = async () => {
  await router.push({query: {...route.query, page: page.value, perPage: perPage.value}});
};

const editData = (data) => {
  modals.showModal('EditUser', data)
};

const setAdmin = async (data) => {
  modals.showModal('SetAdmin', data)
};

const changePassword = (data) => {
  modals.showModal('ChangePassword', data)
};

const removeItem = (data) => {
  modals.showModal('RemoveUser', data)
};

onMounted(() => {
  updateQueryParams();
});

watch([page, perPage], updateQueryParams, {deep: true});

const fetchData = async () => {
  try {
    await users.getUserList();
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await users.getUserList(route.query.page, route.query.perPage);
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            Пользователи
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех пользователей вашей учетной записи, включая их имена, должности, адреса электронной почты и
            роли.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              v-if="users.userProfile?.role?.code === 'admin'"
              @click="modals.showModal('CreateUser')"
              type="button"
              class="block rounded-md bg-mainColor px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Добавить пользователя
          </button>
        </div>
      </div>
      <TableComponent
          :edit="true"
          :search="true"
          :makeAdmin="'is_admin'"
          :changePassword="true"
          :tableData="tableData"
          :fetchedData="userList"
          :remove-item="true"
          @editValue="editData"
          @setAdmin="setAdmin"
          @changePassword="changePassword"
          @removeItem="removeItem"
          @call_to_refresh="fetchData"
      />
    </div>
  </div>
</template>
