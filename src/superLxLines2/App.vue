<template>
  <div>
    <router-view v-bind:rName="name" v-if="show"></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const superagent = require("superagent");
import { ReLocal899Origin } from "@/../Js/superLxLines2/urlRe";
import { IPageType, PageType } from "@/../Js/superLxLines2/page-type";
import {
  initViewSession,
  pushViewSession,
} from "@/../Js/superLxLines2/session";
import router from "@/superLxLines2/router";

export default defineComponent({
  name: "app",
  data: function (): {
    // 页面 id
    name: string | null;
    // 路由是否加载
    show: boolean;
  } {
    return {
      name: null,
      show: false,
    };
  },
  methods: {
    // 空占用
    voidFun: (): void => undefined,
    /**
     * @function
     * @async
     * @description 初始路由数据
     */
    initRoute: async function (): Promise<void> {
      let query: Record<string, string | Array<string | null> | null> =
        this.$route.query;
      // 获取 页面 id
      let qName: string | undefined = query.name as string | undefined;
      if (qName === undefined) {
        // 页面 id 未发现
        // 页面不加载
      } else {
        // 页面 id 发现
        this.name = qName;
        // 获取name
        let name: string = this.$route.name as string;
        // 页面加载
        if (name === "" || name === "edit" || name === "app") {
          await router.push({ path: "view", query: query });
        }
        // 初始化view 消除sessionStorage中的数据
        initViewSession();
        pushViewSession(JSON.stringify(await this.getPages()));
        this.show = true;
      }
      // 不再初始化
      this.initRoute = async () => this.voidFun();
    },
    getPages: async function (): Promise<Array<PageType>> {
      let pages: Array<PageType>;
      try {
        let response = await superagent
          .get(`${ReLocal899Origin}data/json/${this.name}.json`)
          .set("accept", "text/json");
        pages = response.body as Array<PageType>;
      } catch (e) {
        // 页面数据不存在
        // 创建默认值
        pages = [new IPageType()];
      }
      return pages;
    },
  },
  watch: {
    $route: {
      // 初始化不监视
      immediate: false,
      handler: function (newValue, oldValue) {
        // 报空出现 疑似bug
        if (typeof oldValue == "undefined") {
          this.voidFun();
        } else {
          this.initRoute();
        }
      },
    },
  },
});
</script>

<style lang="scss">
body {
  margin: 0;
}

#app {
  width: 49em;
  background: papayawhip;
  margin: 0 auto;
  padding: 0 0.5em;
}
</style>
