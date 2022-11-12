<template>
  <div class="pic-side">
    <work-pic-side-item
      v-for="index in page"
      v-bind:key="index"
      v-bind:url="url"
      v-bind:org="org"
      v-bind:page="page"
      v-bind:idx="index - 1"
    ></work-pic-side-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// 单图片显示
import WorkPicSideItem from "@/PixivImage/components/workPicSideItem.vue";

export default defineComponent({
  name: "workPicSide",
  components: { WorkPicSideItem },
  props: {
    // 作品图片链接 small
    url: {
      type: String,
      required: true,
    },
    // 作品图片数量
    page: {
      type: Number,
      required: true,
    },
    // 作品图片链接 origin
    org: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.pic-side {
  float: left;
  width: 60%;
  min-width: 40em;
  margin: 10% 2em 10% 0;
}
</style>
