<template>
  <div id="view">
    <view-tool></view-tool>
    <view-page
      v-for="page in pages"
      v-bind:key="`view-page-${page.id}`"
      v-bind:page="page"
    ></view-page>
    <div class="space-line"></div>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "vue";

import { PageType } from "@/../Js/superLxLines2/page-type";
import {
  getPagesSession,
  pushEditSession,
} from "@/../Js/superLxLines2/session";
import router from "@/superLxLines2/router";
// 工具栏
import ViewTool from "@/superLxLines2/components/viewTool.vue";
// 展示页面
import ViewPage from "@/superLxLines2/components/viewPage.vue";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "viewRoot",
  components: { ViewTool, ViewPage },
  props: {
    rName: {
      type: String,
      required: true,
    },
  },
  data: function (): {
    // 所有页面数据
    pages: Array<PageType> | null;
  } {
    // 获取session所有页面数据
    let sessionPages: string = getPagesSession();
    // 加载所有页面数据
    let pages = JSON.parse(sessionPages);
    return {
      pages: pages,
    };
  },
  methods: {
    /**
     * @function
     * @description 新建页面
     */
    new_open_by_view_tool_end: function () {
      let editPage: number = this.pages!.length;
      let newPage: PageType = {
        id: editPage,
        page: editPage + 1,
        content: [{ content: "", id: 0, space: 0, type: 0 }],
      };
      this.edit_open(newPage);
    },
    /**
     * @function
     * @description 编辑页面数据
     */
    edit_open_by_view_page_end: function (page: unknown) {
      this.edit_open(page as PageType);
    },
    /**
     * @function
     * @description 编辑页面数据 基础
     */
    edit_open: function (page: PageType) {
      pushEditSession(JSON.stringify(page));
      this.edit_jump();
    },
    /**
     * @function
     * @description 跳转到编辑页面
     */
    edit_jump: function () {
      router.push({ path: "edit", query: this.$route.query });
    },
    /**
     * @see re_edit_by_view_tool
     * @see re_edit_by_view_tool_end
     */
    re_edit_by_view_tool_end: function () {
      this.edit_jump();
    },
  },
  mounted: async function (): Promise<void> {
    instance = getCurrentInstance();
    /**
     * @see new_open_by_view_tool
     * @see new_open_by_view_tool_end
     */
    instance!.proxy!.$NativeEventBus.on(
      "new_open_by_view_tool",
      this.new_open_by_view_tool_end
    );
    /**
     * @see edit_open_by_view_page
     * @see edit_open_by_view_page_end
     */
    instance!.proxy!.$NativeEventBus.on(
      "edit_open_by_view_page",
      this.edit_open_by_view_page_end
    );
    /**
     * @see re_edit_by_view_tool
     * @see re_edit_by_view_tool_end
     */
    instance!.proxy!.$NativeEventBus.on(
      "re_edit_by_view_tool",
      this.re_edit_by_view_tool_end
    );
  },
  beforeUnmount(): void {
    instance!.proxy!.$NativeEventBus.off(
      "new_open_by_view_tool",
      this.new_open_by_view_tool_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "edit_open_by_view_page",
      this.edit_open_by_view_page_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "re_edit_by_view_tool",
      this.re_edit_by_view_tool_end
    );
  },
});
</script>

<style scoped></style>
