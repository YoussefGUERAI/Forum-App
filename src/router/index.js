
import { createRouter, createWebHistory } from "vue-router";
import SignupView from "@/views/SignupView.vue";
import LoginView from "@/views/LoginView.vue";

const routes = [
  { path: "/signup", component: SignupView },
  { path: "/login", component: LoginView },
  // other routes
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
