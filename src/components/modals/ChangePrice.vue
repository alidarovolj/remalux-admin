<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notifications.js";
import {useModalsStore} from "@/stores/modals.js";
import {useProductsStore} from "@/stores/products.js";

const notifications = useNotificationStore();
const modals = useModalsStore()
const products = useProductsStore()

const loading = ref(false);

const formEdit = ref({
  retail: '',
  wholesale: ''
});

const v$Edit = useVuelidate({
  retail: {required},
  wholesale: {required}
}, formEdit);

const editVariant = async () => {
  loading.value = true;
  await v$Edit.value.$validate();

  if (v$Edit.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    await products.changePriceVariant(modals.modal.modalData.id, formEdit.value);
    if (products.changedVariantPrice) {
      notifications.showNotification("success", "Цена варианта продукта успешно отредактирована!", "Вы можете увидеть отредактированные данные в списке вариантов");
      await products.getProductVariantsList()
      modals.modal.show = false;
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await nextTick()
  formEdit.value.retail = parseInt(modals.modal.modalData.prices.retail)
  formEdit.value.wholesale = parseInt(modals.modal.modalData.prices.wholesale)
})
</script>

<template>
  <div>
    <div>
      <p class="font-semibold text-xl mb-5">
        Редактирование цены продукта
      </p>
      <p class="text-sm mb-3">
        Заполните все поля для завершения редактирования цены продукта.
      </p>
    </div>
    <div>
      <div class="flex justify-between mb-2 text-xs">
        <p>Введите значения</p>
      </div>
      <div class="flex gap-2 items-center">
        <div
            :class="{ '!border !border-red-500': v$Edit.retail.$error }"
            class="w-full rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Оптовая цена
          </label>
          <input
              v-model="formEdit.retail"
              type="number"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Введите значение"
          />
        </div>
        <div
            :class="{ '!border !border-red-500': v$Edit.wholesale.$error }"
            class="w-full rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Розничная цена
          </label>
          <input
              v-model="formEdit.wholesale"
              type="number"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Введите значение"
          />
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
          v-if="!loading"
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="editVariant"
      >
        Сохранить
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
</template>