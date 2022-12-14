import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import App from "@/superLxLines2/App.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "app",
    component: App,
    children: [
      {
        path: "view",
        name: "view",
        component: () =>
          import(
            /* webpackChunkName: 'superLxLines2-viewApp' */ "@/superLxLines2/components/viewApp.vue"
          ),
      },
      {
        path: "edit",
        name: "edit",
        component: () =>
          import(
            /* webpackChunkName: 'superLxLines2-editApp' */ "@/superLxLines2/components/editApp.vue"
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
