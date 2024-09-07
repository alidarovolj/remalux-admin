<script setup>
import {ArrowLongLeftIcon} from "@heroicons/vue/24/outline/index.js";
import {nextTick, onMounted, ref} from "vue";
import {useOrdersStore} from "@/stores/orders.js";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import TableComponent from "@/components/TableComponent.vue";
import {formatDate} from "@/utils/formatDate.js";
import {useModalsStore} from "@/stores/modals.js";
import {formatPhoneNumber} from "@/utils/formatPhoneNumber.js";

const orders = useOrdersStore()
const {ordersDetail} = storeToRefs(orders)
const route = useRoute()
const modals = useModalsStore()

const tableData = ref([
  {name: "Фото", fn: "product_image", type: "image"},
  {name: "Название", fn: "product_name.ru", type: "string"},
  {name: "Количество", fn: "quantity", type: "boolean"},
  {name: "Цена", fn: "price", type: "string"}
])

onMounted(async () => {
  await nextTick()
  await orders.getOrdersDetail(route.params.id)
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div>
        <div>
          <div>
            <div>
              <RouterLink
                  to="/orders"
                  class="flex gap-2 items-center mb-5">
                <div>
                  <ArrowLongLeftIcon class="w-5 h-5"/>
                </div>
                <p>
                  Назад
                </p>
              </RouterLink>
              <div v-if="ordersDetail">
                <div class="flex flex-col md:flex-row items-center justify-between mb-10 gap-5">
                  <div class="flex items-center gap-5 w-full">
                    <p class="font-semibold text-xl">
                      Заказ №{{ ordersDetail.id }}
                    </p>
                    <div
                        :class="[
                        { 'bg-green-100 text-green-500' : ordersDetail.status === 'ended' },
                        { 'bg-blue-100 text-blue-500' : ordersDetail.status === 'created' },
                        { 'bg-orange-100 text-orange-500' : ordersDetail.status === 'in_process' }
                    ]"
                        class="w-max px-4 py-2 rounded-md capitalize"
                    >
                      <span v-if="ordersDetail.status === 'created'">Создан</span>
                      <span v-else-if="ordersDetail.status === 'ended'">Окончен</span>
                      <span v-else-if="ordersDetail.status === 'in_process'">В процессе</span>
                      <span v-else>{{ ordersDetail.status }}</span>
                    </div>
                  </div>
                  <button
                      v-if="ordersDetail.status !== 'ended'"
                      type="button"
                      class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                      @click="modals.showModal('UpdateOrderStatus', ordersDetail)"
                  >
                    Сменить статус заказа
                  </button>
                  <button
                      type="button"
                      class="inline-flex w-max justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                      @click="modals.showModal('UpdateOrderPayment', ordersDetail)"
                  >
                    Сменить статус оплаты
                  </button>
                </div>
                <div class="flex items-center w-full gap-3">
                  <p class="font-semibold">Дата создания заказа:</p>
                  <p>{{ formatDate(ordersDetail.created_at) }}</p>
                </div>
                <div
                    v-if="ordersDetail.user && ordersDetail.user_address"
                    class="mb-10">
                  <p class="mb-5 font-bold text-mainColor">Заказчик:</p>
                  <div class="flex flex-col gap-3">
                    <div class="flex items-center">
                      <p class="w-1/5 font-semibold">Фото:</p>
                      <img class="w-10 h-10 rounded-full" :src="ordersDetail.user.image_url" alt="">
                    </div>
                    <div class="flex items-center">
                      <p class="w-1/5 font-semibold">Имя:</p>
                      <p class="w-4/5">{{ ordersDetail.user.name }}</p>
                    </div>
                    <div class="flex items-center">
                      <p class="w-1/5 font-semibold">Город:</p>
                      <p class="w-4/5">{{ ordersDetail.user.city_title.ru }}</p>
                    </div>
                    <div class="flex items-center">
                      <p class="w-1/5 font-semibold">Email:</p>
                      <a :href="`mailto:${ordersDetail.user.email}`"
                         class="w-4/5 text-mainColor">{{ ordersDetail.user.email }}</a>
                    </div>
                    <div class="flex items-center">
                      <p class="w-1/5 font-semibold">Номер телефона:</p>
                      <a :href="`tel:${ordersDetail.user.phone_number}`"
                         class="w-4/5 text-mainColor">{{ formatPhoneNumber(ordersDetail.user.phone_number) }}</a>
                    </div>
                    <div class="flex items-center">
                      <p class="w-1/5 font-semibold">Адрес доставки:</p>
                      <p class="w-4/5">{{ ordersDetail.user_address.address }}<span
                          v-if="ordersDetail.user_address.entrance">, {{
                          ordersDetail.user_address.entrance
                        }} подъезд</span><span v-if="ordersDetail.user_address.floor">, {{
                          ordersDetail.user_address.floor
                        }} этаж</span><span v-if="ordersDetail.user_address.float">, {{
                          ordersDetail.user_address.float
                        }} квартира</span></p>
                    </div>
                    <div class="flex items-center">
                      <p class="w-1/5 font-semibold">Дата доставки:</p>
                      <p v-if="ordersDetail.delivery_date" class="w-4/5">{{ ordersDetail.delivery_date }}</p>
                      <p v-else class="w-4/5 text-red-500">Не указано</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between font-semibold">
                    <p class="font-bold text-mainColor">Список продуктов:</p>
                    <p
                        v-if="ordersDetail.is_paid"
                        class="text-green-600 px-4 py-2 bg-green-100 rounded-lg"
                    >
                      Оплачен
                    </p>
                    <p
                        v-else
                        class="text-red-600 px-4 py-2 bg-red-100 rounded-lg"
                    >
                      Не оплачен
                    </p>
                  </div>
                  <TableComponent
                      :tableData="tableData"
                      :fetchedData="ordersDetail.order_items"
                      @call_to_refresh="orders.getOrdersDetail(route.params.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
