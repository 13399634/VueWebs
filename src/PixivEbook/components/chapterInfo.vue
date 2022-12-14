<template>
  <div>
    <top-p>
      {{ chapterName }} - <span id="author">{{ author }}</span>
    </top-p>
    <h3-p>封面</h3-p>
    <div id="cover">
      <img v-bind:src="coverUrl" alt="cover" />
    </div>
    <h3-p>标签</h3-p>
    <p class="tags">
      <span class="tag" v-for="(tag, index) in tags" v-bind:key="index">{{
        tag
      }}</span>
    </p>
    <h3-p>简介</h3-p>
    <line-p
      v-for="(description, index) in descriptions"
      v-bind:key="index"
      class="description"
    >
      {{ description }}
    </line-p>
    <p class="h3">正文</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ReLocal899Origin } from "@/../Js/PixivEbook/urlRe";
import TopP from "@/../pasteButton v1.2/topP.vue";
import H3P from "@/../pasteButton v1.2/h3P.vue";
import LineP from "@/../pasteButton v1.2/lineP.vue";

export default defineComponent({
  name: "chapterInfo",
  components: { LineP, H3P, TopP },
  props: {
    // 章节名
    chapterName: {
      type: String,
      required: true,
    },
    // 章节 id
    cid: {
      type: String,
      required: true,
    },
    // 简介
    descriptions: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
    // 标签
    tags: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
    // 作者
    author: {
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
    // 章节封面链接
    coverUrl: function (): string {
      return `${ReLocal899Origin}/data/pic/pixivEbook${this.uid}_${this.cid}cover.png`;
    },
  },
});
</script>
