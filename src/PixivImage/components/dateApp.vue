<template>
  <div>
    <date-position></date-position>
    <date-jump></date-jump>
    <date-item></date-item>
  </div>
</template>

<script lang="ts">
// 日期定位
import DatePosition from "@/PixivImage/components/datePosition.vue";
// 快速跳转 +-日期
import DateJump from "@/PixivImage/components/dateJump.vue";
// 图片展示
import DateItem from "@/PixivImage/components/dateItem.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "dateApp",
  components: { DateItem, DateJump, DatePosition },
});
</script>
