import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import AboutPage from "../pages/AboutPage.vue";
import RobotsPage from "../pages/RobotsPage.vue";
import RobotDetailPage from "../pages/RobotDetailPage.vue";
import DocsPage from "../pages/DocsPage.vue";
import DocDetailPage from "../pages/DocDetailPage.vue";
import ContactPage from "../pages/ContactPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/about", name: "about", component: AboutPage },
    { path: "/robots", name: "robots", component: RobotsPage },
    { path: "/robots/:slug", name: "robot-detail", component: RobotDetailPage },
    { path: "/open-docs", name: "open-docs", component: DocsPage },
    { path: "/open-docs/:slug", name: "open-doc-detail", component: DocDetailPage },
    { path: "/contact", name: "contact", component: ContactPage },
    { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundPage },
  ],
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

export default router;
