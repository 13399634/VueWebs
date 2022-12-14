<template>
  <h4-p>
    <template #default>{{ line }}</template>
  </h4-p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import H4P from "@/../pasteButton v1.2/h4P.vue";

export default defineComponent({
  name: "chapterItem",
  components: { H4P },
  props: {
    // 段落
    line: {
      type: String,
      required: true,
    },
  },
});
</script>
