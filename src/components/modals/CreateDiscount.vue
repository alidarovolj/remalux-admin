<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {vMaska} from "maska/vue"
import {email, required} from "@vuelidate/validators";
import {useModalsStore} from "@/stores/modals.js";
import {useNotificationStore} from "@/stores/notifications.js";
import {useUsersStore} from "@/stores/users.js";
import {useDiscountStore} from "@/stores/discounts.js";
import {XMarkIcon} from "@heroicons/vue/24/outline/index.js";
import {useProductsStore} from "@/stores/products.js";

const loading = ref(false);

const modals = useModalsStore()
const notifications = useNotificationStore();
const products = useProductsStore();
const users = useUsersStore()
const discounts = useDiscountStore();
const showProductPicker = ref(false)
const searchProduct = ref('')
const productPickerContainer = ref(null);
const pickedProduct = ref(null);

const form = ref({
  user_id: null,
  product_variant_id: null,
  title: "",
  start_date: "",
  end_date: "",
  value: "",
  note: ""
});

const v$ = useVuelidate({
  user_id: {required},
  product_variant_id: {required},
  title: {required},
  start_date: {required},
  end_date: {required},
  value: {required}
}, form);

const createDiscount = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification("error", "Данные не заполнены", "Проверьте правильность введенных данных и попробуйте снова.");
    loading.value = false;
    return;
  }

  try {
    await discounts.createDiscount(form.value);
    if (discounts.createdDiscount) {
      notifications.showNotification("success", "Успех", "Скидка успешно создана");
      await discounts.getDiscountList();
      modals.modal.show = false;
    }
  } catch (e) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    loading.value = false;
  }
};

const handleClickOutside = (event) => {
  if (productPickerContainer.value && !productPickerContainer.value.contains(event.target)) {
    showProductPicker.value = false;
  }
};

onMounted(async () => {
  await nextTick();
  document.addEventListener('click', handleClickOutside);
  await products.getProductVariantsListAll()
  await users.getUserListAll()
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div>
    <div>
      <div>
        <div>
          <p class="font-semibold text-xl mb-5">
            Создание скидки
          </p>
          <p class="text-sm mb-3">
            Заполните все поля для создания скидки для пользователя
          </p>
        </div>
        <div
            v-if="products.productVariantsListAll"
            :class="{ '!border !border-red-500': v$.product_variant_id.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Продукт
          </label>
          <select
              v-model="form.product_variant_id"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name=""
              id="">
            <option :value="null">Выберите продукт</option>
            <option
                v-for="product in products.productVariantsListAll.data"
                :value="product.id">
              {{ product.product.title.ru }}
            </option>
          </select>
        </div>
        <div
            v-if="users.userListAll"
            :class="{ '!border !border-red-500': v$.user_id.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Пользователь
          </label>
          <select
              v-model="form.user_id"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name=""
              id="">
            <option :value="null">Выберите пользователя</option>
            <option
                v-for="user in users.userListAll.data"
                :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div
            :class="{ '!border !border-red-500': v$.title.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Название
          </label>
          <input
              v-model="form.title"
              type="text"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Плановая скидка"
          />
        </div>
        <div
            :class="{ '!border !border-red-500': v$.start_date.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Дата начала
          </label>
          <input
              v-model="form.start_date"
              type="datetime-local"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Плановая скидка"
          />
        </div>
        <div
            :class="{ '!border !border-red-500': v$.end_date.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Дата окончания
          </label>
          <input
              v-model="form.end_date"
              type="datetime-local"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Плановая скидка"
          />
        </div>
        <div
            :class="{ '!border !border-red-500': v$.value.$error }"
            class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Скидка %
          </label>
          <input
              v-model="form.value"
              type="number"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Величина скидки в %"
          />
        </div>
        <div class="mb-2 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <label
              for="name"
              class="block text-xs font-medium text-gray-900">
            Заметка (необязательно)
          </label>
          <textarea
              v-model="form.note"
              type="number"
              name="name"
              id="name"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Например: Скидка для новых клиентов"
          />
        </div>
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
              v-if="!loading"
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
              @click="createDiscount"
          >
            Создать
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