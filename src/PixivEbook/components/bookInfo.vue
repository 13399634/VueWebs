<template>
  <div>
    <TopP>
      {{ bookName }} - <span id="author">{{ author }}</span>
    </TopP>
    <h3-p>简介</h3-p>
    <line-p
      class="description"
      v-for="(d, index) in description"
      v-bind:key="index"
    >
      {{ d }}
    </line-p>
    <h3-p>目录</h3-p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TopP from "@/../pasteButton v1.2/topP.vue";
import H3P from "@/../pasteButton v1.2/h3P.vue";
import LineP from "@/../pasteButton v1.2/lineP.vue";

export default defineComponent({
  name: "bookInfo",
  components: { LineP, H3P, TopP },
  props: {
    // 作者
    author: {
      type: String,
      required: true,
    },
    // 书名
    bookName: {
      type: String,
      required: true,
    },
    // 简介
    description: {
      type: String,
      required: true,
    },
  },
});
</script>
