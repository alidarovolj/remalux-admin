<script setup>
import { ArrowLongLeftIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { nextTick, onMounted, ref, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useNotificationStore } from "@/stores/notifications.js";
import { useRoute, useRouter } from "vue-router";
import { useContactsStore } from "@/stores/contacts.js";
import YandexMap from "@/components/YandexMaps.vue";
import { vMaska } from "maska/vue";
import { storeToRefs } from "pinia";

const notifications = useNotificationStore();
const currentLanguage = ref("ru");
const router = useRouter();
const route = useRoute();
const contacts = useContactsStore();
const { citiesList } = storeToRefs(contacts);

const days = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const fillAddress = (data) => {
  form.value.address = data.address;
  form.value.latitude = data.latitude.toString();
  form.value.longitude = data.longitude.toString();
};

// Поле формы с дополнительным полем для типа номера
const form = ref({
  city_id: null,
  longitude: null,
  latitude: null,
  address: null,
  main_phone: null,
  main_email: null,
  isMobile: true, // Флаг для типа номера
  break: {
    start_time: "",
    end_time: "",
  },
  work_time: [
    { start_time: "", end_time: "" },
    { start_time: "", end_time: "" },
    { start_time: "", end_time: "" },
    { start_time: "", end_time: "" },
    { start_time: "", end_time: "" },
    { start_time: "", end_time: "" },
    { start_time: "", end_time: "" },
  ],
  contact_items: {
    email: [],
    phone: [],
  },
  office: null,
  floor: null,
});

const updateMask = (item) => {
  if (item.phoneType === "mobile") {
    item.mask = "+7 (###) ###-##-##"; // Маска для сотового телефона
  } else {
    const selectedCityId = form.value.city_id;
    const selectedCity = citiesList.value.find(
      (city) => city.id === selectedCityId
    );

    if (selectedCity) {
      const cityName = selectedCity.title;
      item.mask = cityPhoneMasks[cityName] || "+7 (####) ##-##-##"; // Маска для городского телефона
    } else {
      item.mask = "+7 (####) ##-##-##"; // Маска по умолчанию для городского телефона
    }
  }
};

const addEmail = () => {
  form.value.contact_items.email.push({
    type: "email",
    title: "Email",
    value: "",
  });
};

const addPhone = () => {
  form.value.contact_items.phone.push({
    type: "phone",
    title: "",
    value: "",
    phoneType: "mobile",
    mask: getPhoneMask({ phoneType: "mobile" }),
  });
};

const v$ = useVuelidate(
  {
    city_id: { required },
    longitude: { required },
    latitude: { required },
    address: { required },
    main_phone: { required },
    main_email: { required },
    break: {
      start_time: { required },
      end_time: { required },
    },
  },
  form
);

// Маппинг масок телефонов для городских номеров
const cityPhoneMasks = {
  Капшагай: "+7 (72772) ##-##-##",
  Жезказган: "+7 (7102) ##-##-##",
  Костанай: "+7 (7142) ##-##-##",
  Кызылорда: "+7 (7242) ##-##-##",
  Павлодар: "+7 (7182) ##-##-##",
  Петропавловск: "+7 (7152) ##-##-##",
  Рудный: "+7 (71431) ##-##-##",
  Семей: "+7 (7222) ##-##-##",
  Талдыкорган: "+7 (7282) ##-##-##",
  Темиртау: "+7 (7213) ##-##-##",
  "Усть-Каменогорск": "+7 (7232) ##-##-##",
  Тараз: "+7 (7262) ##-##-##",
};

// Вычисляемое свойство для динамической маски
const phoneMask = computed(() => {
  if (form.value.isMobile) {
    return "+7 (###) ###-##-##"; // Маска для сотового номера
  }

  const selectedCityId = form.value.city_id;
  const selectedCity = citiesList.value.find(
    (city) => city.id === selectedCityId
  );

  if (selectedCity) {
    const cityName = selectedCity.title;
    return cityPhoneMasks[cityName] || "+7 (####) ##-##-##"; // Маска для городского номера
  }

  return "+7 (####) ##-##-##"; // Маска по умолчанию для городского номера
});

// Функция для получения маски в зависимости от типа номера
const getPhoneMask = (phoneType) => {
  const city = citiesList.value.find((city) => city.id == form.value.city_id);
  const cityName = city?.title;

  if (!city) {
    console.error("City not found");
    return "+7 (####) ##-##-##"; // Маска по умолчанию
  }

  console.log(city); // Убедимся, что город найден

  if (phoneType === "mobile") {
    return "+7 (###) ###-##-##"; // Маска для сотового телефона
  } else {
    return cityPhoneMasks[cityName] || "+7 (####) ##-##-##"; // Маска для городского телефона
  }
};

// Функция для редактирования контакта
const createContact = async () => {
  await v$.value.$validate();

  if (v$.value.$error) {
    notifications.showNotification(
      "error",
      "Данные не заполнены",
      "Проверьте все поля на странице."
    );
    console.log(form.value);
    return;
  }

  try {
    await contacts.createContact(form.value);
    if (contacts.createdContact) {
      notifications.showNotification(
        "success",
        "Контакт успешно создан",
        "Контакт успешно создан, его можно увидеть в списке контактов."
      );
      await router.push("/contacts");
    }
  } catch (e) {
    if (e.response) {
      if (e.response.status !== 500) {
        notifications.showNotification(
          "error",
          "Произошла ошибка",
          e.response.data.message
        );
      } else {
        notifications.showNotification(
          "error",
          "Ошибка сервера!",
          "Попробуйте позже."
        );
      }
    } else {
      console.error(e);
      notifications.showNotification(
        "error",
        "Произошла ошибка",
        "Неизвестная ошибка"
      );
    }
  }
};

// Функция для переключения типа номера (сотовый/городской)
const togglePhoneType = (item) => {
  item.phoneType = item.phoneType === "mobile" ? "landline" : "mobile";
  item.mask = getPhoneMask(item); // Обновляем маску с помощью getPhoneMask
};

// Загрузка данных
const fetchData = async () => {
  try {
    await contacts.getCities();
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await nextTick();
  await fetchData();
});
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div>
      <RouterLink to="/contacts" class="flex gap-2 items-center mb-5">
        <div>
          <ArrowLongLeftIcon class="w-5 h-5" />
        </div>
        <p>Назад</p>
      </RouterLink>
      <div class="flex justify-between mb-5">
        <p class="font-semibold text-xl">Создание контакта</p>
        <button
          type="button"
          class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
          @click="createContact"
        >
          Создать
        </button>
      </div>
      <p class="text-sm mb-3">
        Заполните все поля для создания нового контакта.
      </p>
    </div>
    <p class="font-semibold mb-5">Бизнес регион</p>
    <div
      v-if="citiesList"
      :class="{ '!border !border-red-500': v$.city_id.$error }"
      class="mb-5 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
    >
      <label for="city" class="block text-xs font-medium text-gray-900">
        Город
      </label>
      <select
        v-model="form.city_id"
        :class="{ 'border-red-500': v$.city_id.$error }"
        class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
        name="city"
        id="city"
      >
        <option :value="null">Выберите город</option>
        <option
          v-for="(city, index) of contacts.citiesList"
          :key="index"
          :value="city.id"
        >
          {{ city.title }}
        </option>
      </select>
    </div>
    <p class="font-semibold mb-5">Контакты</p>
    <div>
      <div
        :class="{ '!border !border-red-500': v$.main_email.$error }"
        class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
      >
        <label for="name" class="block text-xs font-medium text-gray-900">
          Основной E-mail
        </label>
        <input
          v-model="form.main_email"
          type="text"
          name="name"
          id="name"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Введите E-mail"
        />
      </div>
      <div
        v-for="(item, index) of form.contact_items.email"
        :key="index"
        class="flex gap-5 items-center mb-3"
      >
        <div
          class="w-1/4 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
        >
          <label for="name" class="block text-xs font-medium text-gray-900">
            Название
          </label>
          <input
            v-model="item.title"
            type="text"
            name="name"
            id="name"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Название контакта"
          />
        </div>
        <div
          class="w-full rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
        >
          <label for="name" class="block text-xs font-medium text-gray-900">
            E-mail
          </label>
          <input
            v-model="item.value"
            type="text"
            name="name"
            id="name"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Введите E-mail"
          />
        </div>
        <TrashIcon
          @click="form.contact_items.email.splice(index, 1)"
          class="w-7 h-7 text-red-500 cursor-pointer"
        />
      </div>
      <div @click="addEmail" class="text-blue-400 text-sm mb-3">
        + Добавить E-mail
      </div>
    </div>
    <div class="mb-5">
      <div class="mb-5">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Тип номера:
        </label>
        <div class="flex items-center text-sm">
          <label class="mr-3">
            <input
              type="radio"
              v-model="form.isMobile"
              :value="true"
              @change="togglePhoneType({ phoneType: 'mobile' })"
            />
            Сотовый
          </label>
          <label>
            <input
              type="radio"
              v-model="form.isMobile"
              :value="false"
              @change="togglePhoneType({ phoneType: 'landline' })"
            />
            Городской
          </label>
        </div>
      </div>

      <!-- Поле ввода телефона с динамической маской -->
      <div
        :class="{ '!border !border-red-500': v$.main_phone.$error }"
        class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
      >
        <label for="name" class="block text-xs font-medium text-gray-900">
          Основной телефон
        </label>
        <input
          v-model="form.main_phone"
          v-maska="phoneMask"
          type="text"
          name="name"
          id="name"
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Введите телефон"
        />
      </div>
      <div
        v-for="(item, index) in form.contact_items.phone"
        :key="index"
        class="flex gap-5 items-center mb-3"
      >
        <!-- Поле для названия контакта -->
        <div
          class="w-1/4 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
        >
          <label for="name" class="block text-xs font-medium text-gray-900">
            Название
          </label>
          <input
            v-model="item.title"
            type="text"
            name="name"
            id="name"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Название контакта"
          />
        </div>

        <!-- Выпадающий список для выбора типа телефона -->
        <div
          class="w-1/4 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
        >
          <label
            for="phoneType"
            class="block text-xs font-medium text-gray-900"
          >
            Тип телефона
          </label>
          <select
            v-model="item.phoneType"
            @change="updateMask(item)"
            class="block w-full border-0 p-0 text-gray-900 sm:text-sm sm:leading-6"
          >
            <option value="mobile">Сотовый</option>
            <option value="landline">Городской</option>
          </select>
        </div>

        <!-- Поле для телефона с динамической маской -->
        <div
          class="w-full rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
        >
          <label for="phone" class="block text-xs font-medium text-gray-900">
            Телефон
          </label>
          <input
            v-model="item.value"
            v-maska="item.mask"
            type="text"
            name="phone"
            id="phone"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Введите телефон"
          />
        </div>

        <!-- Иконка для удаления телефона -->
        <TrashIcon
          @click="form.contact_items.phone.splice(index, 1)"
          class="w-7 h-7 text-red-500 cursor-pointer"
        />
      </div>

      <div @click="addPhone" class="text-blue-400 text-sm mb-3">
        + Добавить телефон
      </div>
    </div>
    <div class="mb-5">
      <p class="font-semibold mb-5">График работы</p>
      <div>
        <div class="flex flex-col">
          <div>
            <div
              v-for="(item, index) of form.work_time"
              :key="index"
              :class="{ 'mb-3': index + 1 !== form.work_time.length }"
              class="flex items-center gap-5"
            >
              <p class="w-[100px] min-w-[100px] text-sm">{{ days[index] }}</p>
              <div
                class="w-1/3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
              >
                <label
                  for="name"
                  class="block text-xs font-medium text-gray-900"
                >
                  Начало дня
                </label>
                <div class="flex gap-5">
                  <input
                    v-model="form.work_time[index].start_time"
                    type="time"
                    name="name"
                    id="name"
                    class="block w-max border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="График работы в будние дни"
                  />
                </div>
              </div>
              <div
                class="w-1/3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
              >
                <label
                  for="name"
                  class="block text-xs font-medium text-gray-900"
                >
                  Конец дня
                </label>
                <div class="flex gap-5">
                  <input
                    v-model="form.work_time[index].end_time"
                    type="time"
                    name="name"
                    id="name"
                    class="block w-max border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="График работы в будние дни"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-5">
      <p class="font-semibold mb-5">Перерыв</p>
      <div>
        <div class="flex flex-col">
          <div>
            <div class="flex items-center gap-5">
              <div
                :class="{
                  '!border !border-red-500 rounded-md':
                    v$.break.start_time.$error,
                }"
                class="w-1/3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
              >
                <label
                  for="name"
                  class="block text-xs font-medium text-gray-900"
                >
                  Начало перерыва
                </label>
                <div class="flex gap-5">
                  <input
                    v-model="form.break.start_time"
                    type="time"
                    name="name"
                    id="name"
                    class="block w-max border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="График работы в будние дни"
                  />
                </div>
              </div>
              <div
                :class="{
                  '!border !border-red-500 rounded-md':
                    v$.break.end_time.$error,
                }"
                class="w-1/3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
              >
                <label
                  for="name"
                  class="block text-xs font-medium text-gray-900"
                >
                  Конец перерыва
                </label>
                <div class="flex gap-5">
                  <input
                    v-model="form.break.end_time"
                    type="time"
                    name="name"
                    id="name"
                    class="block w-max border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="График работы в будние дни"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <p class="font-semibold mb-5">Адрес филиала</p>
      <YandexMap @send_data="fillAddress" />
      <div class="mb-4 mt-5 text-sm">
        <label for="address" class="block text-sm font-semibold">
          Добавьте адрес
        </label>
        <p
          :class="{ '!border !border-red-500 rounded-md': v$.address.$error }"
          v-if="!form.address"
          class="text-red-500 border-b border-[#F0DFDF] p-3"
        >
          Пожалуйста, выберите адрес на карте
        </p>
        <p v-else>
          {{ form.address }}
        </p>
      </div>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div
          class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
        >
          <label for="name" class="block text-xs font-medium text-gray-900">
            Этаж <span class="text-gray-400">(необязательно)</span>
          </label>
          <input
            v-model="form.floor"
            type="text"
            name="name"
            id="name"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Этаж"
          />
        </div>
        <div
          class="mb-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
        >
          <label for="name" class="block text-xs font-medium text-gray-900">
            Офис <span class="text-gray-400">(необязательно)</span>
          </label>
          <input
            v-model="form.office"
            type="text"
            name="name"
            id="name"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Офис"
          />
        </div>
      </div>
    </div>
  </div>
</template>
