import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from "mitt";

const Mitt = mitt();

declare module "vue" {
  export interface ComponentCustomProperties {
    $NativeEventBus: typeof Mitt;
  }
}

const app = createApp(App);
app.use(router);
app.mount("#app");
app.config.globalProperties.$NativeEventBus = Mitt;
