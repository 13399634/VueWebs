<template>
  <div>
    <router-view v-if="show" v-bind:id="id"></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/PixivImageLocal/router";
import {
  chapterAllName,
  chapterWorkName,
} from "@/../Js/PixivImageLocal/routerPath";

export default defineComponent({
  name: "app",
  data: function (): {
    // 路由是否加载
    show: boolean;
    // 作品 id
    id: number | string;
  } {
    return {
      show: false,
      id: 0,
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
      // 获取name
      let name: string = this.$route.name as string;
      let query: Record<string, string | Array<string | null> | null> =
        this.$route.query;
      let id: string | undefined = query.id as string | undefined;
      if (name === chapterAllName) {
        if (query !== {}) {
          await router.push({ path: chapterAllName, query: {} });
        }
      } else if (name === chapterWorkName) {
        if (id === undefined) {
          await router.push({ path: chapterAllName, query: {} });
        } else {
          this.id = id;
        }
      } else {
        await router.push({ path: chapterAllName, query: {} });
      }
      this.show = true;
      // 不再初始化
      this.initRoute = async () => this.voidFun();
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
