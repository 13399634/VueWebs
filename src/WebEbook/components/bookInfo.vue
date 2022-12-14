<template>
  <div>
    <TopP>
      <template #default>{{ bookName }}</template>
    </TopP>
    <H3P>
      <template #default>作者</template>
    </H3P>
    <H4P>
      <template #default>{{ author }}</template>
    </H4P>
    <H3P>
      <template #default>简介</template>
    </H3P>
    <H4P v-for="(info, index) in description" v-bind:key="index">
      <template #default>{{ info }}</template>
    </H4P>
    <H3P>
      <template #default>目录</template>
    </H3P>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import H3P from "@/../pasteButton v1.2/h3P.vue";
import H4P from "@/../pasteButton v1.2/h4P.vue";
import TopP from "@/../pasteButton v1.2/topP.vue";

export default defineComponent({
  name: "bookInfo",
  components: { TopP, H3P, H4P },
  props: {
    // 书名
    bookName: {
      type: String,
      required: true,
    },
    // 作者
    author: {
      type: String,
      required: true,
    },
    // 简介
    description: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
  },
});
</script>
