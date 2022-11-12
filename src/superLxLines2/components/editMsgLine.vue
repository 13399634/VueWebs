<template>
  <p v-bind:style="{ color: color }">{{ info }}</p>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { MsgLineColor } from "@/../Js/superLxLines2/msg-line-type";

export default defineComponent({
  name: "editMsgLine",
  props: {
    // 颜色
    color: {
      type: String as PropType<MsgLineColor>,
      required: true,
    },
    // 输出信息
    info: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
p {
  width: 15em;
}
</style>
