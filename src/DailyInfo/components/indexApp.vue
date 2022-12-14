<template>
  <div id="nBody">
    <index-top></index-top>
    <index-flow></index-flow>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// 页面头部 工具
import IndexTop from "@/DailyInfo/components/indexJump.vue";
// 可选编辑日期展示
import IndexFlow from "@/DailyInfo/components/indexFlow.vue";

export default defineComponent({
  name: "indexApp",
  components: { IndexFlow, IndexTop },
});
</script>

<style lang="scss">
body {
  margin: 0 auto;
  width: 50em;
}
</style>
