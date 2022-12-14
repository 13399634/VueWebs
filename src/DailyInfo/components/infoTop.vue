<template>
  <div id="top">
    <input type="button" id="home" value="home">
    <span id="this-date">2022年08月07日</span>
    <input type="button" id="new-time" value="新的一条记录" disabled="">
    <input type="button" id="change-tag" value="改变标签" disabled="disabled">
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "infoTop",
});
</script>

<style scoped>

</style>