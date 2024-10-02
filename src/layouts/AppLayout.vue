<script setup>
import {useUsersStore} from "@/stores/users.js";
import {computed, nextTick, onMounted, ref} from "vue";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue';
import {
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  BriefcaseIcon,
  ChartPieIcon,
  ChevronDownIcon,
  CircleStackIcon,
  CreditCardIcon,
  EnvelopeIcon,
  FolderIcon,
  HomeIcon,
  HomeModernIcon,
  LightBulbIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  TagIcon,
  TruckIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import {RouterLink, useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import Footer from "@/components/Footer.vue";

const route = useRoute()

const navigation = [
  {name: 'Главная', href: '/', icon: HomeIcon, alias: 'MainPage', section: "mainPage", children: []},
  {name: 'Пользователи', href: '/users', icon: UsersIcon, alias: 'Users', section: "users", children: []},
  {name: 'Заказы', href: '/orders', icon: TruckIcon, alias: 'Orders', section: "orders", children: []},
  {
    name: 'Продукты', href: '/products', icon: FolderIcon, alias: 'Products', section: "products", children: [
      {
        name: 'Вариации',
        href: '/products/variants',
        icon: CircleStackIcon,
        alias: 'ProductsVariants',
        section: "variants",
        children: []
      },
      {name: 'Категории', href: '/categories', icon: TagIcon, alias: 'Categories', section: "categories", children: []},
      {
        name: 'Фильтры',
        href: '/filters',
        icon: AdjustmentsHorizontalIcon,
        alias: 'Filters',
        section: "filters",
        children: []
      },
      {name: 'Скидки', href: '/discounts', icon: CreditCardIcon, alias: 'Discounts', section: "products", children: []},
    ]
  },
  {
    name: 'Отзывы',
    href: '/products/reviews',
    icon: ChartPieIcon,
    alias: 'ProductsReviews',
    section: "reviews",
    children: []
  },
  {name: 'Идеи', href: '/ideas', icon: LightBulbIcon, alias: 'Ideas', section: "ideas", children: []},
  {
    name: 'Новости', href: '/news', icon: NewspaperIcon, alias: 'News', section: "news", children: [
      {
        name: 'Подписчики на рассылку',
        href: '/news/subscriptions',
        icon: EnvelopeIcon,
        alias: 'Subscriptions',
        section: "news",
        children: []
      },
    ]
  },
  {name: 'Партнеры', href: '/partners', icon: BriefcaseIcon, alias: 'Partners', section: "partners", children: []},
  {name: 'FAQ', href: '/faq', icon: QuestionMarkCircleIcon, alias: 'FAQ', section: "faq", children: []},
  {
    name: 'Проекты',
    href: '/projects',
    icon: WrenchScrewdriverIcon,
    alias: 'Projects',
    section: "projects",
    children: []
  },
  {name: 'Контакты', href: '/contacts', icon: HomeModernIcon, alias: 'Contacts', section: "contacts", children: []},
]

const sidebarOpen = ref(false)

const users = useUsersStore()
const {userProfile} = storeToRefs(users)

const filteredLinks = computed(() => {
  if (userProfile.value) {
    const {role, sections} = userProfile.value;

    if (role.code === 'admin') {
      return navigation;
    } else {
      return navigation.filter(item => {
        // Check if the user has access to the main section or any child sections
        return sections.includes(item.section) || item.children.some(child => sections.includes(child.section));
      });
    }
  } else {
    console.log('No profile')
  }
});

onMounted(async () => {
  await nextTick()
  if(localStorage.getItem('token')) {
    await users.getProfile();
  }
});
</script>

<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
                         enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
                         leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80"/>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                           enter-from="-translate-x-full" enter-to="translate-x-0"
                           leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                           leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                               enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                               leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true"/>
                  </button>
                </div>
              </TransitionChild>

              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div class="flex h-16 shrink-0 items-center">
                  <img class="h-8 w-auto" src="@/assets/img/logos/logo.svg" alt="Your Company"/>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in filteredLinks" :key="item.name">
                          <RouterLink :to="item.href"
                                      :class="[route.name === item.alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                            <component :is="item.icon"
                                       :class="[route.name === item.alias ? 'text-mainColor' : 'text-gray-400 group-hover:text-mainColor', 'h-6 w-6 shrink-0']"
                                       aria-hidden="true"/>
                            {{ item.name }}
                          </RouterLink>
                          <div v-if="item.children.length > 0" class="pl-4">
                            <RouterLink v-for="(child, ind) in item.children" :key="ind" :to="child.href"
                                        :class="[route.name === child.alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                              <component :is="child.icon"
                                         :class="[route.name === child.alias ? 'text-mainColor' : 'text-gray-400 group-hover:text-mainColor', 'h-6 w-6 shrink-0']"
                                         aria-hidden="true"/>
                              {{ child.name }}
                            </RouterLink>
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" src="@/assets/img/logos/logo.svg" alt="Your Company"/>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li>
                  <RouterLink :to="navigation[0].href"
                              :class="[route.name === navigation[0].alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                    <component :is="navigation[0].icon"
                               :class="[route.name === navigation[0].alias ? 'text-mainColor' : 'text-gray-400 group-hover:text-mainColor', 'h-6 w-6 shrink-0']"
                               aria-hidden="true"/>
                    {{ navigation[0].name }}
                  </RouterLink>
                </li>
                <li v-for="item in filteredLinks" :key="item.name">
                  <RouterLink :to="item.href"
                              :class="[route.name === item.alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                    <component :is="item.icon"
                               :class="[route.name === item.alias ? 'text-mainColor' : 'text-gray-400 group-hover:text-mainColor', 'h-6 w-6 shrink-0']"
                               aria-hidden="true"/>
                    {{ item.name }}
                  </RouterLink>
                  <div v-if="item.children.length > 0" class="pl-4">
                    <RouterLink v-for="(child, ind) in item.children" :key="ind" :to="child.href"
                                :class="[route.name === child.alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                      <component :is="child.icon"
                                 :class="[route.name === child.alias ? 'text-mainColor' : 'text-gray-400 group-hover:text-mainColor', 'h-6 w-6 shrink-0']"
                                 aria-hidden="true"/>
                      {{ child.name }}
                    </RouterLink>
                  </div>
                </li>
              </ul>
            </li>
            <li v-if="userProfile" class="mt-auto">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton
                      class="inline-flex w-full justify-between items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                    <div
                        class="flex items-center gap-x-4 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                      <img
                          class="h-8 w-8 rounded-full bg-gray-50"
                          :src="userProfile.image_url"
                          alt=""
                      />
                      <span class="sr-only">Your profile</span>
                      <span aria-hidden="true">{{ userProfile.email }}</span>
                    </div>
                    <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true"/>
                  </MenuButton>
                </div>

                <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95">
                  <MenuItems
                      class="absolute right-0 z-10 mt-2 -top-full w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="py-1">
                      <MenuItem
                          @click="users.logout"
                          class="cursor-pointer">
                        <p class="block px-4 py-2 text-sm text-red-500">
                          Выйти
                        </p>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
        <Bars3Icon class="h-6 w-6" aria-hidden="true"/>
      </button>
      <a href="#">
        <span class="sr-only">Your profile</span>
        <img class="h-8 w-8 rounded-full bg-gray-50"
             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
             alt=""/>
      </a>
    </div>

    <main class="lg:pl-72 pt-10">
      <div>
        <div>
          <slot/>
        </div>
      </div>
      <Footer/>
    </main>
  </div>
</template>
