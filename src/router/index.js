import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const checkAuth = (to, from, next) => {
  //
  let isAuth = false;
  //
  onAuthStateChanged(getAuth(), (user) => {
    const authStore = useAuthStore();
    if (user && !isAuth) {
      isAuth = true;
      authStore.userId = user.uid;
      next();
    } else if (!user && !isAuth) {
      authStore.userId = "";
      isAuth = true;
      next("/auth");
    }
  });
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/views/AuthView.vue"),
  },
  {
    path: "/interview/:id",
    name: "Interview",
    component: () => import("@/views/InterviewView.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/interviews",
    name: "Interviews",
    component: () => import("@/views/InterviewsView.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/statistics",
    name: "Statistics",
    component: () => import("@/views/StatisticsView.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/notfound",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
  },
  {
    path: "/:catchall(.*)*",
    name: "404",
    component: () => import("@/views/404View.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
