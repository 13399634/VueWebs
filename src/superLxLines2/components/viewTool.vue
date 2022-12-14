<template>
  <div id="view-tool">
    <button v-on:click="new_open_by_view_tool">新建</button>
    <button v-on:click="re_edit_by_view_tool" v-if="pageJump">
      返回编辑页面
    </button>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "vue";
import { getPageSession } from "@/../Js/superLxLines2/session";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "ViewTool",
  data: function (): { pageJump: boolean } {
    return {
      pageJump: getPageSession() !== "",
    };
  },
  methods: {
    /**
     * @function
     * @description 新建页面
     * @see new_open_by_view_tool
     * @see new_open_by_view_tool_end
     */
    new_open_by_view_tool: function () {
      instance!.proxy!.$NativeEventBus.emit("new_open_by_view_tool");
    },
    /**
     * @function
     * @description 返回编辑页面 可以保存sessionStorage中的为发送到服务器中的page数据
     * @see re_edit_by_view_tool
     * @see re_edit_by_view_tool_end
     */
    re_edit_by_view_tool: function () {
      instance!.proxy!.$NativeEventBus.emit("re_edit_by_view_tool");
    },
  },
  mounted() {
    instance = getCurrentInstance();
  },
});
</script>

<style scoped>
#view-tool {
  position: fixed;
  left: 2em;
  top: 2em;
}
</style>
