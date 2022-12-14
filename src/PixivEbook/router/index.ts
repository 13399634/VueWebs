import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import App from "@/PixivEbook/App.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "app",
    component: App,
    children: [
      {
        path: "index",
        name: "index",
        component: () =>
          import(
            /* webpackChunkName: 'PixivEbook-allApp' */ "@/PixivEbook/components/indexApp.vue"
          ),
      },
      {
        path: "book",
        name: "book",
        component: () =>
          import(
            /* webpackChunkName: 'PixivEbook-bookApp' */ "@/PixivEbook/components/bookApp.vue"
          ),
      },
      {
        path: "chapter",
        name: "chapter",
        component: () =>
          import(
            /* webpackChunkName: 'PixivEbook-chapterApp' */ "@/PixivEbook/components/chapterApp.vue"
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
