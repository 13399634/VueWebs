<template>
  <div>
    <a class="pic-org" v-bind:href="getOrg" target="_blank">
      <img class="img" v-bind:src="getUrl" v-bind:alt="`view-${this.idx}`" />
    </a>
    <p class="page">{{ this.idx + 1 }} - {{ this.page }}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { RePximgOriginP } from "@/../Js/PixivImage/urlRe";

export default defineComponent({
  name: "workPicSideItem",
  props: {
    // 作品图片链接 small
    url: {
      type: String,
      required: true,
    },
    // 作品图片链接 origin
    org: {
      type: String,
      required: true,
    },
    // 作品图片数量
    page: {
      type: Number,
      required: true,
    },
    // 作品图片序列 start: 0 end: page-1 len: page
    idx: {
      type: Number,
      required: true,
    },
  },
  computed: {
    getUrl(): string {
      // 检索图片源<生产状态下代理> 格式化 为当前序列
      return RePximgOriginP(this.url).replace("p0", `p${this.idx}`);
    },
    getOrg(): string {
      // 检索图片源<生产状态下代理> 格式化 为当前序列
      return RePximgOriginP(this.org).replace("0.", `${this.idx}.`);
    },
  },
});
</script>

<style scoped>
.img {
  width: 100%;
}

.page {
  text-align: center;
}
</style>
