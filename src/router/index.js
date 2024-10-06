import {createRouter, createWebHistory} from 'vue-router'

import loginView from '@/views/login/index.vue'
import usersView from '@/views/users/index.vue'
import dashboardView from '@/views/dashboard/index.vue'
import productsView from "@/views/products/index.vue";
import productCreate from "@/views/products/create/index.vue";
import categoriesView from "@/views/categories/index.vue";
import productsEdit from "@/views/products/edit/index.vue";
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
import colorsView from "@/views/colors/index.vue"
import colorGroupsView from "@/views/colors/colorGroups/index.vue"
import colorGroupsDetail from "@/views/colors/colorGroups/detail.vue"
import {useUsersStore} from "@/stores/users.js";

const routes = [
    {
        path: '/login',
        name: "Login",
        component: loginView
    },
    {
        path: '/faq',
        name: "FAQ",
        component: faqView,
        meta: {
            requiresAuth: true,
            section: 'faq',
        }
    },
    {
        path: '/projects',
        name: "Projects",
        component: projectsView,
        meta: {
            requiresAuth: true,
            section: 'projects',
        }
    },
    {
        path: '/discounts',
        name: "Discounts",
        component: discountsView,
        meta: {
            requiresAuth: true,
            section: 'products',
        }
    },
    {
        path: '/partners',
        name: "Partners",
        component: partnersView,
        meta: {
            requiresAuth: true,
            section: 'partners',
        }
    },
    {
        path: '/news/subscriptions',
        name: "Subscriptions",
        component: subscriptionsView,
        meta: {
            requiresAuth: true,
            section: 'news',
        }
    },
    {
        path: '/orders',
        name: "Orders",
        component: ordersView,
        meta: {
            requiresAuth: true,
            section: 'orders',
        }
    },
    {
        path: '/orders/:id',
        name: "OrdersDetail",
        component: ordersDetail,
        meta: {
            requiresAuth: true,
            section: 'orders',
        }
    },
    {
        path: '/contacts',
        name: "Contacts",
        component: contactsView,
        meta: {
            requiresAuth: true,
            section: 'contacts',
        }
    },
    {
        path: '/contacts/create',
        name: "CreateContacts",
        component: contactsCreate,
        meta: {
            requiresAuth: true,
            section: 'contacts',
        }
    },
    {
        path: '/contacts/edit/:id',
        name: "EditContacts",
        component: contactsEdit,
        meta: {
            requiresAuth: true,
            section: 'contacts',
        }
    },
    {
        path: '/',
        name: "MainPage",
        component: dashboardView,
    },
    {
        path: '/users',
        name: "Users",
        component: usersView,
        meta: {
            requiresAuth: true,
            section: 'users',
        }
    },
    {
        path: '/categories',
        name: "Categories",
        component: categoriesView,
        meta: {
            requiresAuth: true,
            section: 'categories',
        }
    },
    {
        path: '/ideas',
        name: "Ideas",
        component: ideasView,
        meta: {
            requiresAuth: true,
            section: 'ideas'
        }
    },
    {
        path: '/ideas/create',
        name: "IdeasCreate",
        component: ideasCreate,
        meta: {
            requiresAuth: true,
            section: 'ideas',
        }
    },
    {
        path: '/ideas/edit/:id',
        name: "IdeasEdit",
        component: ideasEdit,
        meta: {
            requiresAuth: true,
            section: 'ideas',
        }
    },
    {
        path: '/products',
        name: "Products",
        component: productsView,
        meta: {
            requiresAuth: true,
            section: 'products',
        }
    },
    {
        path: '/filters',
        name: "Filters",
        component: filtersView,
        meta: {
            requiresAuth: true,
            section: 'filters',
        }
    },
    {
        path: '/products/variants',
        name: "ProductsVariants",
        component: productVariantsView,
        meta: {
            requiresAuth: true,
            section: 'variants',
        }
    },
    {
        path: '/products/reviews',
        name: "ProductsReviews",
        component: productReviewsView,
        meta: {
            requiresAuth: true,
            section: 'reviews',
        }
    },
    {
        path: '/products/edit/:id',
        name: "ProductsEdit",
        component: productsEdit,
        meta: {
            requiresAuth: true,
            section: 'products'
        }
    },
    {
        path: '/products/create',
        name: "ProductsCreate",
        component: productCreate,
        meta: {
            requiresAuth: true,
            section: 'products',
        }
    },
    {
        path: '/news',
        name: "News",
        component: newsView,
        meta: {
            requiresAuth: true,
            section: 'news',
        }
    },
    {
        path: '/news/create',
        name: "NewsCreate",
        component: newsCreate,
        meta: {
            requiresAuth: true,
            section: 'news',
        }
    },
    {
        path: '/news/categories',
        name: "NewsCategories",
        component: newsCategories,
        meta: {
            requiresAuth: true,
            section: 'news',
        }
    },
    {
        path: '/colors',
        name: "Colors",
        component: colorsView,
        meta: {
            requiresAuth: true,
            section: 'colors',
        }
    },
    {
        path: '/color-groups',
        name: "ColorGroups",
        component: colorGroupsView,
        meta: {
            requiresAuth: true,
            section: 'colorGroups',
        }
    },
    {
        path: '/color-groups/:id',
        name: "ColorGroupsDetail",
        component: colorGroupsDetail,
        meta: {
            requiresAuth: true,
            section: 'colorGroups',
        }
    },
    {
        path: '/news/edit/:id',
        name: "NewsEdit",
        component: newsEdit,
        meta: {
            requiresAuth: true,
            section: 'news',
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token');
    const users = useUsersStore();

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            return next('/login');
        }

        try {
            if (!users.profileFetched) {
                await users.getProfile();
            }

            const userProfile = users.userProfile;
            const allowedSections = userProfile.sections;

            if (userProfile.role && userProfile.role.code === 'admin') {
                next();
            } else if (allowedSections.includes(to.meta.section)) {
                next();
            } else {
                next('/403');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            next('/login');
        }
    } else {
        next();
    }
});

export default router;