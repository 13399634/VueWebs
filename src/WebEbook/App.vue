<template>
  <div>
    <router-view v-if="show" v-bind:bid="bid" v-bind:cid="cid"></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/WebEbook/router";
import { allName, bookName, chapterName } from "@/../Js/WebEbook/routerPath";

export default defineComponent({
  name: "app",
  data: function (): {
    // 路由是否加载
    show: boolean;
    // 书本 id
    bid: number | string;
    // 章节 id
    cid: number | string;
  } {
    return {
      show: false,
      bid: 0,
      cid: 0,
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
      let bid: string | undefined = query.bid as string | undefined;
      let cid: string | undefined = query.cid as string | undefined;
      if (name === allName) {
        if (query !== {}) {
          await router.push({ path: allName, query: {} });
        }
      } else if (name === bookName) {
        if (bid === undefined) {
          await router.push({ path: allName, query: {} });
        } else {
          this.bid = bid;
        }
      } else if (name === chapterName) {
        if (bid === undefined || cid === undefined) {
          await router.push({ path: allName, query: {} });
        } else {
          this.bid = bid!;
          this.cid = cid!;
        }
      } else {
        await router.push({ path: allName, query: {} });
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

<style lang="scss" src="../../pasteButton v1.2/pasteButtonType.scss"></style>
