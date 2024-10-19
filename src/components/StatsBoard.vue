<script setup>
import {PlusSmallIcon} from '@heroicons/vue/20/solid'
import {useAnalyticsStore} from "@/stores/analytics.js";
import {storeToRefs} from "pinia";
import {nextTick, onMounted, ref} from "vue";

const analytics = useAnalyticsStore()
const {analyticsList} = storeToRefs(analytics)

const dates = ref({
  from: '2024-01-01',
  to: '2025-01-01'
})

const secondaryNavigation = [
  {name: 'Последние 7 дней', href: '#', current: true},
  {name: 'Последние 30 дней', href: '#', current: false},
  {name: 'За все время', href: '#', current: false},
]

const stats = [
  {name: 'Доход', value: '$405,091.00', change: '+4.75%', changeType: 'positive'},
  {name: 'Просроченные счета', value: '$12,787.00', change: '+54.02%', changeType: 'negative'},
  {name: 'Неоплаченные счета', value: '$245,988.00', change: '-1.39%', changeType: 'positive'},
  {name: 'Затраты', value: '$30,156.00', change: '+10.18%', changeType: 'negative'},
]

onMounted(async () => {
  await nextTick()
  await analytics.getAnalyticsList(dates.value)

  analyticsList.orders?.forEach((order) => {
    const randomChange = (Math.random() * 10).toFixed(2) + "%";
    const randomChangeType = Math.random() > 0.5 ? 'positive' : 'negative';

    stats.push({
      name: order.name || 'Unnamed',
      value: order.value || '0',
      change: randomChange,
      changeType: randomChangeType,
    })
  })
})

</script>

<template>
  <div class="mb-10">
    <div class="relative isolate overflow-hidden">
      <!-- Secondary navigation -->
      <header class="pb-4 pt-6 sm:pb-6">
        <div class="flex w-full flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <h1 class="text-base font-semibold leading-7 text-gray-900">Денежный поток</h1>
          <div
              class="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
            <a v-for="item in secondaryNavigation" :key="item.name" :href="item.href"
               :class="item.current ? 'text-mainColor' : 'text-gray-700'">{{ item.name }}</a>
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
          <div v-for="(stat, statIdx) in stats" :key="stat.name"
               :class="[statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '', 'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8']">
            <dt class="text-sm font-medium leading-6 text-gray-500">{{ stat.name }}</dt>
            <dd :class="[stat.changeType === 'negative' ? 'text-rose-600' : 'text-gray-700', 'text-xs font-medium']">
              {{ stat.change }}
            </dd>
            <dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">{{
                stat.value
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