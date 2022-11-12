import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import App from "@/superLxLines2/App.vue";
import viewApp from "@/superLxLines2/components/viewApp.vue";
import editApp from "@/superLxLines2/components/editApp.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "app",
    component: App,
    children: [
      {
        path: "view",
        name: "view",
        component: viewApp,
      },
      {
        path: "edit",
        name: "edit",
        component: editApp,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
