<template>
  <footer class="bg-white">
    <div class="mx-auto w-full overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
      <nav class="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
        <div v-for="item in navigation.main" :key="item.name" class="pb-6">
          <a :href="item.href" class="text-sm leading-6 text-gray-600 hover:text-gray-900">{{ item.name }}</a>
        </div>
      </nav>
      <p class="mt-10 text-center text-xs leading-5 text-gray-500">&copy; 2024 Remalux. Все права защищены.</p>
    </div>
  </footer>
</template>

<script setup>
import { defineComponent, h } from 'vue'

const navigation = {
  main: [
    { name: 'Главная панель', href: '/' },
    { name: 'Пользователи', href: '/users' },
    { name: 'Продукты', href: '/products' },
    { name: 'Категории', href: '/categories' },
    { name: 'Идеи', href: '/ideas' },
    { name: 'Бренды', href: '/brands' },
    { name: 'Фильтры', href: '/filters' },
  ]
}
</script>