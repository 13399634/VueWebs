<template>
  <h4-p>
    <template #default>
      <a v-bind:href="url" target="_blank"> {{ chapterName }}</a>
    </template>
  </h4-p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { chapterUrl } from "@/../Js/WebEbook/routerPath";
import H4P from "@/../pasteButton v1.2/h4P.vue";

export default defineComponent({
  name: "bookItem",
  components: { H4P },
  props: {
    // 书本id
    bid: {
      type: [String, Number],
      required: true,
    },
    // index
    idx: {
      type: Number,
      required: true,
    },
    // 章节名
    chapterName: {
      type: String,
      required: true,
    },
  },
  computed: {
    // 书本章节页
    url: function (): string {
      return chapterUrl(this.bid, this.idx + 1);
    },
  },
});
</script>
