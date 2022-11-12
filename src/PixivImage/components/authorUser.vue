<template>
  <div class="top">
    <img class="pic" v-bind:src="pic" alt="author-pic" />
    <p class="author">{{ author }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "authorUser",
  props: {
    // 用户名
    author: {
      type: String,
      required: true,
    },
    // 头像图片地址
    pic: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.top {
  display: inline-block;
  margin-left: 3em;

  .pic {
    border-radius: 50%;
    width: 8em;
  }

  .author {
    display: inline-block;
    font-size: 3em;
    margin: 0;
    position: relative;
    top: -1em;
  }
}
</style>
