import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import App from "@/WebEbook/App.vue";

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
            /* webpackChunkName: 'WebEbook-allApp' */ "@/WebEbook/components/allApp.vue"
          ),
      },
      {
        path: "book",
        name: "book",
        component: () =>
          import(
            /* webpackChunkName: 'WebEbook-bookApp' */ "@/WebEbook/components/bookApp.vue"
          ),
      },
      {
        path: "chapter",
        name: "chapter",
        component: () =>
          import(
            /* webpackChunkName: 'WebEbook-chapterApp' */ "@/WebEbook/components/chapterApp.vue"
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
