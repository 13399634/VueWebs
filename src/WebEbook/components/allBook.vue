<template>
  <h3P>
    <template #default>
      <a v-bind:href="url" target="_blank">
        <span class="code">{{ bookName }}</span> - {{ author }}
      </a>
    </template>
  </h3P>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { bookUrl } from "@/../Js/WebEbook/routerPath";
import h3P from "@/../pasteButton v1.2/h3P.vue";

export default defineComponent({
  name: "allBook",
  components: { h3P },
  props: {
    bid: {
      type: [Number, String],
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    bookName: {
      type: String,
      required: true,
    },
  },
  computed: {
    // 书本目录页
    url: function (): string {
      return bookUrl(this.bid);
    },
  },
});
</script>
