import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import App from "../App.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "app",
    component: App,
    children: [
      {
        path: "chapter-work",
        name: "chapter-work",
        component: () =>
          import(
            /* webpackChunkName: 'PixivImageLocal-chapterWorkApp' */ "../components/chapterWorkApp.vue"
          ),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
