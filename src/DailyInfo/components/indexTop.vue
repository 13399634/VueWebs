<template>
  <div id="top">
    <label for="search-value">日期: </label>
    <input type="text" id="search-value" />
    <input type="button" id="search-position" value="定位" />
    <br />
    <input type="button" id="new-date" v-on:click="newDateJump" value="今天" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/DailyInfo/router";

export default defineComponent({
  name: "indexTop",
  methods: {
    newDateJump: function (): void {
      router.push({ path: "info", name: "info", query: { date: "new" } });
    },
  },
});
</script>

<style lang="scss" scoped>
#top {
  background: yellowgreen;
  padding: 0.5em 3em 1em 3em;
}
</style>
