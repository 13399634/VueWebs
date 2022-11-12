<template>
  <div class="handle-side">
    <work-handle-top v-bind:title="title" v-bind:user="user"></work-handle-top>
    <work-handle-send-id
      v-bind:id="id"
      v-bind:title="title"
      v-bind:org="org"
      v-bind:page="page"
      v-bind:user="user"
    ></work-handle-send-id>
    <work-update-pics v-bind:other="other"></work-update-pics>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
// 侧边栏头部 作者作品页面链接
import WorkHandleTop from "@/PixivImage/components/workHandleTop.vue";
// 服务器发送信息 预处理 方便作品本地储存
import WorkHandleSendId from "@/PixivImage/components/workHandleSendId.vue";
// 作品的一些近期相关作品展示
import WorkUpdatePics from "@/PixivImage/components/workUpdatePics.vue";

// 用户信息数据
interface UserType {
  // uid
  uid: string;
  // 用户名
  author: string;
}

export default defineComponent({
  name: "workHandleSide",
  components: { WorkHandleTop, WorkHandleSendId, WorkUpdatePics },
  props: {
    // 作品id
    id: {
      type: String,
      required: true,
    },
    // 作品名称
    title: {
      type: String,
      required: true,
    },
    // 作品图片链接 origin
    org: {
      type: String,
      required: true,
    },
    // 作品图片数量
    page: {
      type: Number,
      required: true,
    },
    // 作品的一些近期相关作品id
    other: {
      type: Array as PropType<string[]>,
      required: true,
    },
    // 用户信息数据
    user: {
      type: Object as PropType<UserType>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.handle-side {
  width: 40%;
  min-width: 20em;
  margin: 0 0 0 60%;
}
</style>
