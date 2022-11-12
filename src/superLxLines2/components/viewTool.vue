<template>
  <div id="view-tool">
    <button v-on:click="new_open_by_view_tool">新建</button>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "vue";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "ViewTool",
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
