<template>
  <div class="top-line">
    <span class="tool-order">序列</span>
    <span class="tool-type">类型</span>
    <span class="tool-tool">工具</span>
    <span class="tool-content">内容</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "editLineTop",
});
</script>

<style lang="scss" scoped>
.top-line {
  font-size: 1.2em;
  font-weight: bold;

  .tool-order {
    padding-left: 0.6em;
  }
}
</style>
