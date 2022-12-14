<template>
  <h4-p v-if="type === -1">{{ line }}</h4-p>
  <div class="h4" v-else-if="type === 0">
    <div class="img-z">
      <img v-bind:src="coverUrl" alt="pixiv ebook" />
    </div>
  </div>
  <div class="h4r" v-else-if="type === 1">
    <hr />
  </div>
  <p class="hr" v-else-if="type === 2">---------------分割线---------------</p>
  <h4-p v-else-if="type === 3">{{ line }}</h4-p>
  <div class="h4r" v-if="type === 3">
    <hr />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import H4P from "@/../pasteButton v1.2/h4P.vue";
import { ReLocal899Origin } from "@/../Js/PixivEbook/urlRe";

const picRE = /pic\d+.[a-zA-Z\d]+/;

export default defineComponent({
  name: "chapterItem",
  components: { H4P },
  props: {
    // 章节 id
    cid: {
      type: String,
      required: true,
    },
    // 用户 id
    uid: {
      type: String,
      required: true,
    },
    // 段落
    line: {
      type: String,
      required: true,
    },
  },
  computed: {
    type: function (): number {
      if (this.line.search(picRE) !== -1) {
        return 0;
      } else if (this.line === "<hr/>") {
        return 1;
      } else if (this.line === '<span class="center">下一页</span>') {
        return 2;
      } else if (this.line.slice(-5) == "<hr/>") {
        return 3;
      } else {
        return -1;
      }
    },
    coverUrl: function (): string {
      if (this.type === 0) {
        return `${ReLocal899Origin}/data/pic/pixivEbook${this.uid}_${this.cid}${
          this.line.match(picRE)![0]
        }`;
      } else {
        return "";
      }
    },
  },
});
</script>
