<template>
  <div class="line" v-bind:class="lineClass">
    <span v-bind:class="contentClass">{{ contentText }}</span>
  </div>
</template>

<script lang="ts">
import { ContentType } from "@/../Js/superLxLines2/page-type";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "viewLine",
  props: {
    line: {
      type: Object as PropType<ContentType>,
      required: true,
    },
  },
  computed: {
    // 空格
    space: function (): string {
      return " ".repeat(this.line.space);
    },
    // 行class
    lineClass: function (): string {
      return this.line.type === 0 ? "tr1" : "";
    },
    // 内容class
    contentClass: function (): string {
      return this.line.type === 0 ? "pre" : this.line.type === 1 ? "notes" : "";
    },
    // 内容文字
    contentText: function (): string {
      return this.line.type === 0
        ? `${this.space}${this.line.content}`
        : this.line.type === 1
        ? `${this.space}// ${this.line.content}`
        : "";
    },
  },
});
</script>

<style lang="scss" scoped>
.line {
  margin-left: 4em;
  font-size: 1.2em;
  white-space: pre-wrap;

  &.tr1 {
    display: list-item;
    list-style: decimal;
  }

  .notes {
    color: slategrey;
    font-weight: bold;
  }
}
</style>
