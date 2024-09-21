<script setup>
import {ref, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import TableComponent from "@/components/TableComponent.vue";
import {storeToRefs} from "pinia";
import {useModalsStore} from "@/stores/modals.js";
import {useQuestionsStore} from "@/stores/questions.js";

const route = useRoute();
const router = useRouter();
const modals = useModalsStore()

const faq = useQuestionsStore()
const {questionsList} = storeToRefs(faq)

const tableData = ref([
  {name: "ID", fn: "id", type: "string"},
  {name: "Вопрос", fn: "question", type: "string"},
  {name: "Ответ", fn: "answer", type: "string"},
  {name: "Пользователь", fn: "user.name", type: "string"},
  {name: "Отвечающий", fn: "employee.name", type: "string"},
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
    await faq.getQuestions()
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchData);

watch([page, perPage], fetchData);

watch(route.query, async () => {
  await faq.getQuestions(route.query.page, route.query.perPage)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">
            FAQ
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Список всех продуктов вашей компании, включая их названия, описания и категории.
          </p>
        </div>
      </div>
      <TableComponent
          :tableData="tableData"
          :fetchedData="questionsList"
          :search="true"
          @call_to_refresh="fetchData"
          :answer-question="true"
          @answerQuestion="(data) => modals.showModal('AnswerQuestion', data)"
      />
    </div>
  </div>
</template>
