<template>
  <div>
    <div class="author">
      <span class="text">author: </span>
      <span class="link" v-bind:class="linkClass">
        <a v-bind:href="url" v-on:mousedown="ex ? voidFun() : sendUid()">
          {{ user.author }}
        </a>
      </span>
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { getLocalUid, setLocalUid } from "@/../Js/PixivImage/LocalDataRead";

// 用户信息数据
interface UserType {
  // uid
  uid: string;
  // 用户名
  author: string;
}

export default defineComponent({
  name: "workHandleTop",
  props: {
    // 作品名称
    title: {
      type: String,
      required: true,
    },
    // 用户信息数据
    user: {
      type: Object as PropType<UserType>,
      required: true,
    },
  },
  data(): {
    // 本地变量 浏览器中是否储存作者作品页面的浏览记录
    ex: boolean;
  } {
    return {
      ex: `,${getLocalUid()},`.indexOf(`,${this.user.uid},`) !== -1,
    };
  },
  computed: {
    linkClass(): string {
      // 作者作品页面 已浏览则加浅
      return this.ex ? "ex" : "";
    },
    url(): string {
      // 作者作品页面链接
      return `?uid=${this.user.uid}&p=1#/user`;
    },
  },
  methods: {
    // 空函数 空运转
    voidFun: (): void => undefined,
    /**
     * @function
     * @description 提交 作者作品页面 浏览数据
     */
    sendUid(): void {
      // 提交 作者作品页面 浏览数据
      setLocalUid(this.user.uid);
      // 已浏览
      this.ex = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.author {
  .text {
    font-size: 1.8em;
  }

  .link {
    font-size: 2em;

    &.ex {
      opacity: 0.2;
    }

    a {
      text-decoration: none;
    }
  }
}

.title {
  font-size: 2em;
  margin-top: 1.8em;
}
</style>
