import {createWebHistory, createRouter} from 'vue-router'

import loginView from '@/views/login/index.vue'
import usersView from '@/views/users/index.vue'
import dashboardView from '@/views/dashboard/index.vue'
import productsView from "@/views/products/index.vue";
import productCreate from "@/views/products/create/index.vue";
import categoriesView from "@/views/categories/index.vue";
import productsEdit from "@/views/products/edit/index.vue";
import brandsView from "@/views/brands/index.vue";
import ideasView from "@/views/ideas/index.vue";
import ideasCreate from "@/views/ideas/create/index.vue";
import filtersView from "@/views/filters/index.vue";
import productVariantsView from "@/views/products/variants/index.vue";
import newsView from "@/views/news/index.vue";
import newsCreate from "@/views/news/create/index.vue";
import newsEdit from "@/views/news/edit/index.vue";
import ideasEdit from "@/views/ideas/edit/index.vue";
import newsCategories from "@/views/news/categories/index.vue";
import contactsView from "@/views/contacts/index.vue";
import contactsCreate from "@/views/contacts/create/index.vue";
import contactsEdit from "@/views/contacts/edit/index.vue";
import ordersView from "@/views/orders/index.vue";
import ordersDetail from "@/views/orders/[id]/index.vue";
import discountsView from "@/views/discounts/index.vue";
import subscriptionsView from "@/views/news_subscribers/index.vue";
import partnersView from "@/views/partners/index.vue";
import faqView from "@/views/questions/index.vue";
import projectsView from "@/views/projects/index.vue";
import productReviewsView from "@/views/products/reviews/index.vue";

const routes = [
    {
        path: '/login',
        name: "Login",
        component: loginView
    },
    {
        path: '/faq',
        name: "FAQ",
        component: faqView
    },
    {
        path: '/projects',
        name: "Projects",
        component: projectsView
    },
    {
        path: '/discounts',
        name: "Discounts",
        component: discountsView
    },
    {
        path: '/partners',
        name: "Partners",
        component: partnersView
    },
    {
        path: '/news/subscriptions',
        name: "Subscriptions",
        component: subscriptionsView
    },
    {
        path: '/orders',
        name: "Orders",
        component: ordersView
    },
    {
        path: '/orders/:id',
        name: "OrdersDetail",
        component: ordersDetail
    },
    {
        path: '/contacts',
        name: "Contacts",
        component: contactsView
    },
    {
        path: '/contacts/create',
        name: "CreateContacts",
        component: contactsCreate
    },
    {
        path: '/contacts/edit/:id',
        name: "EditContacts",
        component: contactsEdit
    },
    {
        path: '/',
        name: "Dashboard",
        component: dashboardView,
        meta: {requiresAuth: true}
    },
    {
        path: '/users',
        name: "Users",
        component: usersView,
        meta: {requiresAuth: true}
    },
    {
        path: '/categories',
        name: "Categories",
        component: categoriesView,
        meta: {requiresAuth: true}
    },
    {
        path: '/brands',
        name: "Brands",
        component: brandsView,
        meta: {requiresAuth: true}
    },
    {
        path: '/ideas',
        name: "Ideas",
        component: ideasView,
        meta: {requiresAuth: true}
    },
    {
        path: '/ideas/create',
        name: "IdeasCreate",
        component: ideasCreate,
        meta: {requiresAuth: true}
    },
    {
        path: '/ideas/edit/:id',
        name: "IdeasEdit",
        component: ideasEdit,
        meta: {requiresAuth: true}
    },
    {
        path: '/products',
        name: "Products",
        component: productsView,
        meta: {requiresAuth: true}
    },
    {
        path: '/filters',
        name: "Filters",
        component: filtersView,
        meta: {requiresAuth: true}
    },
    {
        path: '/products/variants',
        name: "ProductsVariants",
        component: productVariantsView,
        meta: {requiresAuth: true}
    },
    {
        path: '/products/reviews',
        name: "ProductsReviews",
        component: productReviewsView,
        meta: {requiresAuth: true}
    },
    {
        path: '/products/edit/:id',
        name: "ProductsEdit",
        component: productsEdit,
        meta: {requiresAuth: true}
    },
    {
        path: '/products/create',
        name: "ProductsCreate",
        component: productCreate,
        meta: {requiresAuth: true}
    },
    {
        path: '/news',
        name: "News",
        component: newsView,
        meta: {requiresAuth: true}
    },
    {
        path: '/news/create',
        name: "NewsCreate",
        component: newsCreate,
        meta: {requiresAuth: true}
    },
    {
        path: '/news/categories',
        name: "NewsCategories",
        component: newsCategories,
        meta: {requiresAuth: true}
    },
    {
        path: '/news/edit/:id',
        name: "NewsEdit",
        component: newsEdit,
        meta: {requiresAuth: true}
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        next('/login');
    } else {
        next();
    }
});

export default router
