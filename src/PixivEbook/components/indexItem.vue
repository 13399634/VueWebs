<template>
  <h3-p>
    <a v-bind:href="url" target="_blank">
      <span class="book" v-if="isBook">书</span>{{ title }} -
      <span class="author">{{ author }}</span>
    </a>
  </h3-p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { bookUrl, chapterUrl } from "@/../Js/PixivEbook/routerPath";
import H3P from "@/../pasteButton v1.2/h3P.vue";

export default defineComponent({
  name: "indexItem",
  components: { H3P },
  props: {
    // 作者
    author: {
      type: String,
      required: true,
    },
    // 展示 id
    sid: {
      type: [String, Number],
      required: true,
    },
    // 书名
    title: {
      type: String,
      required: true,
    },
    // 书本类型
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    // 是否是书本
    isBook: function (): boolean {
      if (this.type === "0") {
        return false;
      } else if (this.type === "1") {
        return true;
      } else {
        throw new SyntaxError("");
      }
    },
    // 图书链接
    url: function (): string {
      if (this.isBook) {
        return bookUrl(this.sid);
      } else {
        return chapterUrl(this.sid);
      }
    },
  },
});
</script>
