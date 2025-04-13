
import { createRouter, createWebHistory } from "vue-router";
import SignupView from "@/views/SignupView.vue";
import LoginView from "@/views/LoginView.vue";
import HomePage from "@/views/HomePage.vue";
import UserView from "@/views/UserView.vue";
import CreateView from "@/views/CreateView.vue";
import DiscussionDetailView from "@/views/DiscussionDetailView.vue";
import ModeratorVue from "@/views/ModeratorVue.vue";
import ReportCreate from "@/views/ReportCreate.vue";

const routes = [
  { path: "/", component: SignupView },
  { path: "/login", component: LoginView },
  { path: "/home", component: HomePage },
  { path: "/profile", component: UserView, props: true },
  { path: "/create", component: CreateView, props: true },
  {path: "/discussion/:id", component: DiscussionDetailView, props: true},
  { path: "/moderator", component: ModeratorVue, props: true },
  { path: "/report", component: ReportCreate, props: true }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
