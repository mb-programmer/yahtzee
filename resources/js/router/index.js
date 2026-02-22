import { createRouter, createWebHistory } from "vue-router";
import YahtzeeIndex from "@/components/yahtzee/Index.vue";
import NotFound from "@/components/NotFound.vue";
import axios from "axios";

const routes = [
    {
        path: "/:catchAll(.*)", // Ongekende paden worden automatisch doorgestuurd naar de 404-pagina
        redirect: "/404",
    },
    {
        path: "/404",
        name: "page.not.found",
        component: NotFound,
    },
    {
        path: "/",
        name: "yahtzee.index",
        component: YahtzeeIndex,
        meta: { requiresAuth: false }, // Pagina vereist authenticatie
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Route Guards
router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth === true) {
        const token = window.localStorage.getItem("token");
        const user = await axios.get("/api/user");

        if (
            (token && user.data.user === null) ||
            (!token && user.data.user == null)
        ) {
            next({ name: "yahtzee.index" });
        }

        if (token && user.data.user !== null) {
            next();
        }
    }

    if (to.meta.requiresAuth === false) {
        const token = window.localStorage.getItem("token");
        const user = await axios.get("/api/user");

        if (token && user.data.user === null) {
            localStorage.removeItem("token");
            next({ name: "yahtzee.index" });
        }

        if (token && user.data.user !== null) {
            next({ name: "yahtzee.index" });
        }

        if (!token) {
            next();
        } else {
            next({ name: "yahtzee.index" });
        }
    }
});

export default router;
