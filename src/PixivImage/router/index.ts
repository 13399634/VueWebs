import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import App from "@/PixivImage/App.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "app",
    component: App,
    children: [
      {
        path: "date",
        name: "date",
        component: () =>
          import(
            /* webpackChunkName: 'PixivImage-dateApp' */ "@/PixivImage/components/dateApp.vue"
          ),
      },
      {
        path: "work",
        name: "work",
        component: () =>
          import(
            /* webpackChunkName: 'PixivImage-workApp' */ "@/PixivImage/components/workApp.vue"
          ),
      },
      {
        path: "/author",
        name: "author",
        component: () =>
          import(
            /* webpackChunkName: 'PixivImage-authorApp' */ "@/PixivImage/components/authorApp.vue"
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
