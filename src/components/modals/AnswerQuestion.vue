<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useModalsStore} from "@/stores/modals.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useUsersStore} from "@/stores/users.js";
import router from "@/router/index.js";
import {useQuestionsStore} from "@/stores/questions.js";
import {storeToRefs} from "pinia";

const loading = ref(false);

const modals = useModalsStore()
const notifications = useNotificationStore();
const questions = useQuestionsStore()
const { detailQuestion } = storeToRefs(questions)

const form = ref({
  answer: ''
});

const v$ = useVuelidate({
  answer: {required},
}, form);

const answerQuestion = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    await questions.answerQuestion(modals.modal.modalData.id, form.value);
    if (questions.answeredQuestion) {
      notifications.showNotification("success", "Успешно", "Вопрос успешно отвечен");
      await questions.getQuestions()
      modals.modal.show = false;
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
  loading.value = false;
};

onMounted(async () => {
  await nextTick()
  await questions.getDetailQuestion(modals.modal.modalData.id)
});
</script>

<template>
  <div>
    <div>
      <div>
        <div>
          <p class="font-semibold text-xl mb-5">
            Ответ на вопрос
          </p>
          <p class="text-sm mb-3">
            Ответьте на вопрос пользователя, чтобы помочь ему решить возникшую проблему.
          </p>
        </div>
        <div class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 mb-3">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Вопрос
          </label>
          <p
              v-if="detailQuestion"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
            {{detailQuestion.question}}
          </p>
        </div>
        <div
            :class="{ '!border !border-red-500': v$.answer.$error }"
            class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Ответ
          </label>
          <textarea
              v-model="form.answer"
              type="text"
              name="answer"
              id="answer"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Введите ответ"
          />
        </div>
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
              v-if="!loading"
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
              @click="answerQuestion"
          >
            Ответить
          </button>
          <div
              v-else
              class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2">
            <span class="spinner"></span>
          </div>
          <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              @click="modals.modal.show = false"
              ref="cancelButtonRef">
            Отменить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>