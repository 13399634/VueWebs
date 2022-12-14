<template>
  <div class="img">
    <img v-bind:src="url" alt="0" />
    <p class="info">{{ index }} - {{ page }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "chapterWorkItem",
  props: {
    // 图片链接
    url: {
      type: String,
      required: true,
    },
    // 作品 页数
    page: {
      type: Number,
      required: true,
    },
    // id序列
    index: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.img {
  .info {
    margin: 2em 0;
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
  }
}
</style>
