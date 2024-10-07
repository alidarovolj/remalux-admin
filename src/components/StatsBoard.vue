<script setup>
import { PlusSmallIcon } from '@heroicons/vue/20/solid';
import { useAnalyticsStore } from "@/stores/analytics.js";
import { nextTick, onMounted, ref, computed } from "vue";
import {storeToRefs} from "pinia";

// Function to format date as 'YYYY-MM-DD'
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Set the initial dates (last 7 days)
const dates = ref({
  from: formatDate(new Date(new Date().setDate(new Date().getDate() - 7))),
  to: formatDate(new Date())
});

const analytics = useAnalyticsStore();
const {analyticsList} = storeToRefs(analytics);

// Secondary navigation options
const secondaryNavigation = ref([
  { name: 'Последние 7 дней', href: '#', current: true, action: 'last7days' },
  { name: 'Последние 30 дней', href: '#', current: false, action: 'last30days' },
  { name: 'Последние 3 месяца', href: '#', current: false, action: 'last3months' },
]);

// Fetch analytics data and handle date range changes
async function setDateRange(range) {
  const currentDate = new Date();

  if (range === 'last7days') {
    dates.value.from = formatDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  } else if (range === 'last30days') {
    dates.value.from = formatDate(new Date(currentDate.setDate(currentDate.getDate() - 30)));
  } else if (range === 'last3months') {
    dates.value.from = formatDate(new Date(currentDate.setMonth(currentDate.getMonth() - 3)));
  }

  dates.value.to = formatDate(new Date()); // Always set 'to' to today

  // Update current selection in secondary navigation
  secondaryNavigation.value.forEach(item => {
    item.current = item.action === range;  // Set current to true for the selected range
  });

  // Fetch updated analytics list after changing the date range
  await nextTick();
  await analytics.getAnalyticsList(dates.value);
}

onMounted(async () => {
  await nextTick();
  await analytics.getAnalyticsList(dates.value);
});

// Compute stats based on the current analytics list, add checks for null/undefined
const stats = computed(() => {
  if (!analyticsList.value) {
    // If analyticsList is null or undefined, return default values
    return {
      orders: {pending: 0, paid: 0, in_delivery: 0, delivery: 0, delivered: 0, in_process: 0, cancel: 0, total: 0},
      sold_products: {amount: '0.00', quantity: 0},
      users: 0,
    };
  }

  // If analyticsList is present, return the real data
  const orders = analyticsList.value.orders || {
    pending: 0,
    paid: 0,
    in_delivery: 0,
    delivery: 0,
    delivered: 0,
    in_process: 0,
    cancel: 0,
    total: 0
  };
  const soldProducts = analyticsList.value.sold_products || {amount: '0.00', quantity: 0};
  const users = analyticsList.value.users || 0;

  return {
    orders,
    sold_products: soldProducts,
    users,
  };
});
</script>

<template>
  <div class="mb-10">
    <div class="relative isolate overflow-hidden">
      <!-- Secondary navigation -->
      <header class="pb-4 pt-6 sm:pb-6">
        <div class="flex w-full flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <h1 class="text-base font-semibold leading-7 text-gray-900">Поток заказов</h1>
          <div
              class="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
            <a v-for="item in secondaryNavigation" :key="item.name" :href="item.href"
               :class="item.current ? 'text-mainColor' : 'text-gray-700'"
               @click.prevent="setDateRange(item.action)">{{ item.name }}</a>
          </div>
          <a href="#"
             class="ml-auto flex items-center gap-x-1 rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColor">
            <PlusSmallIcon class="-ml-1.5 h-5 w-5" aria-hidden="true"/>
            Новый счет
          </a>
        </div>
      </header>

      <!-- Stats -->
      <div class="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
        <dl class="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
          <!-- Total Orders -->
          <div
              class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8">
            <dt class="text-sm font-medium leading-6 text-gray-500">Всего заказов</dt>
            <dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {{ stats.orders.total }}
            </dd>
          </div>

          <!-- Sold Products Amount -->
          <div
              class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8">
            <dt class="text-sm font-medium leading-6 text-gray-500">Сумма проданных товаров</dt>
            <dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {{ stats.sold_products.amount }}
            </dd>
          </div>

          <!-- Sold Products Quantity -->
          <div
              class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8">
            <dt class="text-sm font-medium leading-6 text-gray-500">Количество проданных товаров</dt>
            <dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {{ stats.sold_products.quantity }}
            </dd>
          </div>

          <!-- Total Users -->
          <div
              class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8">
            <dt class="text-sm font-medium leading-6 text-gray-500">Пользователи</dt>
            <dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">{{
                stats.users
              }}
            </dd>
          </div>
        </dl>
      </div>

      <div
          class="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
          aria-hidden="true">
        <div class="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
             style="clip-path: polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)"/>
      </div>
    </div>
  </div>
</template>
