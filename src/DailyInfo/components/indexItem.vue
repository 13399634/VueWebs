<template>
  <div class="flow-date">
    <a v-bind:href="url">
      {{ date.substring(0, 4) }}年{{ date.substring(4, 6) }}月{{
        date.substring(6, 8)
      }}日
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { infoUrl } from "@/../Js/DailyInfo/routerPath";

export default defineComponent({
  name: "indexItem",
  props: {
    // 日期
    date: {
      type: String,
      required: true,
    },
  },
  computed: {
    // 跳转链接
    url: function (): string {
      return infoUrl(this.date);
    },
  },
});
</script>

<style lang="scss" scoped>
.flow-date {
  display: list-item;
  margin: 0.6em 0 0.6em 5em;
  padding: 0 1.5em 0 0;
  list-style: decimal;

  &::marker {
    font-size: 1.3em;
    color: darkgray;
  }

  a {
    font-size: 1.6em;

    &:link {
      color: mediumslateblue;
      text-decoration: none;
    }

    &:visited,
    &:focus,
    &:active {
      color: cornflowerblue;
    }
  }
}
</style>
