<template>
  <h4-p>
    <a v-bind:href="url" target="_blank">{{ chapterName }}</a>
  </h4-p>
  <div class="chapter">
    <div class="cover-l">
      <div class="cover">
        <a v-bind:href="url" target="_blank">
          <img v-bind:src="coverUrl" alt="cover" />
        </a>
      </div>
    </div>
    <div class="description">
      <div v-for="(d, index) in description" v-bind:key="index">
        {{ d }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { chapterUrl } from "@/../Js/PixivEbook/routerPath";
import { ReLocal899Origin } from "@/../Js/PixivEbook/urlRe";
import H4P from "@/../pasteButton v1.2/h4P.vue";

export default defineComponent({
  name: "bookItem",
  components: { H4P },
  props: {
    // 章节名
    chapterName: {
      type: String,
      required: true,
    },
    // 章节简介
    description: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
    // 章节 id
    cid: {
      type: String,
      required: true,
    },
    // 作者 id
    uid: {
      type: String,
      required: true,
    },
  },
  computed: {
    // 章节链接
    url: function (): string {
      return chapterUrl(this.cid);
    },
    // 章节封面链接
    coverUrl: function (): string {
      return `${ReLocal899Origin}/data/pic/pixivEbook${this.uid}_${this.cid}cover.png`;
    },
  },
});
</script>

<style scoped></style>
