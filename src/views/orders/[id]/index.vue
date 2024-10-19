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
  {name: "Количество", fn: "quantity", type: "string"},
  {name: "Цена", fn: "price", type: "string"},
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
                        { 'bg-orange-100 text-orange-500' : ordersDetail.status.code === 'pending' },
                        { 'bg-yellow-100 text-yellow-500' : ordersDetail.status.code === 'paid' },
                        { 'bg-blue-100 text-blue-500' : ordersDetail.status.code === 'in_process' },
                        { 'bg-emerald-100 text-emerald-500' : ordersDetail.status.code === 'delivery' },
                        { 'bg-green-100 text-green-500' : ordersDetail.status.code === 'delivered' },
                        { 'bg-red-100 text-red-500' : ordersDetail.status.code === 'cancel' }
                    ]"
                        class="w-max px-4 py-2 rounded-xl capitalize"
                    >
                      {{ ordersDetail.status.title }}
                    </div>
                  </div>
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
