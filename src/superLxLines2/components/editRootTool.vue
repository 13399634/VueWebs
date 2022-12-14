<template>
  <div id="tool">
    <span id="tool-change">{{ tool_text }}</span>
    <button v-on:click="tool_change_by_edit_root_tool">切换[Ctrl+Q]</button>
    <button v-on:click="clean_space_line_all_by_edit_root_tool">
      清理空行[All]
    </button>
    <button v-on:click="id_true_format_by_edit_root_tool">id 序列化</button>
    <button v-on:click="post_server_data_by_edit_root_tool">打包</button>
    <span class="sp"> │ </span>
    <button v-on:click="give_up_page_by_edit_root_tool">放弃页面</button>
    <button v-on:click="view_content_by_edit_root_tool">预览</button>
    <button v-on:click="post_server_data_then_view_by_edit_root_tool">
      打包并预览
    </button>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  PropType,
} from "vue";
import { throttle_ms } from "@/../Js/timeIn";
import { MsgLineColor } from "@/../Js/superLxLines2/msg-line-type";
import { msgPush } from "@/../Js/superLxLines2/msg-push";
import { toolMap } from "@/../Js/superLxLines2/edit-tool-type";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "editRootTool",
  props: {
    tool: {
      type: String as PropType<toolMap>,
      required: true,
    },
  },
  computed: {
    // 启用工具名称
    tool_text: function (): string {
      return toolMap[this.tool];
    },
  },
  methods: {
    /**
     * @function
     * @description 更改显示工具
     * @see tool_change_by_edit_root_tool
     * @see tool_change_by_edit_root_tool_end
     */
    tool_change_by_edit_root_tool: function () {
      instance!.proxy!.$NativeEventBus.emit("tool_change_by_edit_root_tool");
    },
    /**
     * @function
     * @description 过滤掉空格计数与内容为空的段落
     * @see clean_space_line_all_by_edit_root_tool
     * @see clean_space_line_all_by_edit_root_tool_end
     */
    clean_space_line_all_by_edit_root_tool: function () {
      instance!.proxy!.$NativeEventBus.emit(
        "clean_space_line_all_by_edit_root_tool"
      );
    },
    /**
     * @function
     * @description 段落id与index重新关联
     * @see id_true_format_by_edit_root_tool
     * @see id_true_format_by_edit_root_tool_end
     */
    id_true_format_by_edit_root_tool: function () {
      instance!.proxy!.$NativeEventBus.emit("id_true_format_by_edit_root_tool");
    },
    /**
     * @function
     * @description 将本次编辑的页面数据发送到服务器
     * @see post_server_data_by_edit_root_tool
     * @see post_server_data_by_edit_root_tool_end
     */
    post_server_data_by_edit_root_tool: function (ev: Event) {
      // 请求最小时
      if (throttle_ms(this.post_server_data_by_edit_root_tool, 3000)) {
        ev.preventDefault();
        ev.stopPropagation();
        msgPush(instance, MsgLineColor.red, `请求繁忙, 请3s后再次请求`);
        return;
      }
      instance!.proxy!.$NativeEventBus.emit(
        "post_server_data_by_edit_root_tool"
      );
    },
    /**
     * @function
     * @description 放弃修改本次编辑的页面数据并返回预览页
     * @see give_up_page_by_edit_root_tool
     * @see give_up_page_by_edit_root_tool_end
     */
    give_up_page_by_edit_root_tool: function () {
      instance!.proxy!.$NativeEventBus.emit("give_up_page_by_edit_root_tool");
    },
    /**
     * @function
     * @description 缓存修改本次编辑的页面数据并返回预览页
     * @see view_content_by_edit_root_tool
     * @see view_content_by_edit_root_tool_end
     */
    view_content_by_edit_root_tool: function () {
      instance!.proxy!.$NativeEventBus.emit("view_content_by_edit_root_tool");
    },
    /**
     * @function
     * @description 将本次编辑的页面数据发送到服务器并返回预览页
     * @see post_server_data_then_view_by_edit_root_tool
     * @see post_server_data_then_view_by_edit_root_tool_end
     */
    post_server_data_then_view_by_edit_root_tool: function (ev: Event) {
      // 请求最小时
      if (throttle_ms(this.post_server_data_by_edit_root_tool, 3000)) {
        ev.preventDefault();
        ev.stopPropagation();
        msgPush(instance, MsgLineColor.red, `请求繁忙, 请3s后再次请求`);
        return;
      }
      instance!.proxy!.$NativeEventBus.emit(
        "post_server_data_then_view_by_edit_root_tool"
      );
    },
  },
  mounted: function (): void {
    instance = getCurrentInstance();
  },
});
</script>

<style scoped>
.sp {
  display: inline-block;
  font-weight: bold;
}
</style>
