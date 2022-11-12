<template>
  <div class="img">
    <p class="rank">{{ pic.work.rank }}</p>
    <div class="img-z">
      <a target="_blank" v-bind:href="url" ref="pic">
        <div class="page-c" v-if="pic.work.page !== '1'">
          <div class="page">{{ pic.work.page }}</div>
        </div>
        <img v-bind:src="pic.work.img" v-bind:alt="pic.work.title" />
      </a>
    </div>
    <p class="title">
      <a
        target="_blank"
        v-bind:href="url"
        v-bind:class="work_class"
        ref="title"
      >
        {{ pic.work.title }}
      </a>
    </p>
    <p class="user">
      <a
        target="_blank"
        v-bind:href="link"
        v-bind:class="user_class"
        ref="author"
      >
        {{ pic.user.author }}
      </a>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { setLocalId, setLocalUid } from "@/../Js/PixivImage/LocalDataRead";

// 图片块加载字典数据
interface ItemType {
  work: {
    id: number;
    page: string;
    img: string;
    rank: number;
    title: string;
    haveRead: boolean;
  };
  user: {
    uid: number;
    author: string;
    haveRead: boolean;
  };
}

export default defineComponent({
  name: "dateImg",
  props: {
    // 图片块加载字典数据
    pic: {
      type: Object as PropType<ItemType>,
      required: true,
    },
  },
  data(): {
    // 插件中 储存 id 已读
    workHaveRead: null | boolean;
    // 插件中 储存 uid 已读
    userHaveRead: null | boolean;
  } {
    return {
      workHaveRead: null,
      userHaveRead: null,
    };
  },
  computed: {
    // id跳转链接
    url(): string {
      return `?id=${this["pic"].work.id}#/work`;
    },
    // uid跳转链接
    link(): string {
      return `?uid=${this["pic"].user.uid}#/author`;
    },
    // 插件中 读取 id 已读
    getWorkHaveRead: {
      get(): boolean {
        return this.workHaveRead!;
      },
      set(value: boolean): void {
        this.workHaveRead = value;
      },
    },
    // 插件中 读取 uid 已读
    getUserHaveRead: {
      get(): boolean {
        return this.userHaveRead!;
      },
      set(value: boolean): void {
        this.userHaveRead = value;
      },
    },
    // work class 读取状态
    work_class(): string {
      return this.getWorkHaveRead! ? "have-read" : "";
    },
    // user class 读取状态
    user_class(): string {
      return this.getWorkHaveRead! ? "have-read" : "";
    },
  },
  methods: {
    /**
     * @function
     * @description 增加 id 浏览记录
     */
    setLocalIdAdd(): void {
      // 更新浏览 id 数据
      setLocalId(this.pic.work.id.toString());
      // 插件中 设置 id 已读
      this.getWorkHaveRead = true;
      (this.$refs.pic as unknown as HTMLAnchorElement).removeEventListener(
        "mousedown",
        this.setLocalIdAdd,
        false
      );
      // 解除点击增加浏览 id 的绑定
      (this.$refs.title as unknown as HTMLAnchorElement).removeEventListener(
        "mousedown",
        this.setLocalIdAdd,
        false
      );
    },
    /**
     * @function
     * @description 增加 uid 浏览记录
     */
    setLocalUidAdd(): void {
      // 更新浏览 uid 数据
      setLocalUid(this.pic.user.uid.toString());
      // 插件中 设置 uid 已读
      this.getUserHaveRead = true;
      // 解除点击增加浏览 uid 的绑定
      (this.$refs.author as unknown as HTMLAnchorElement).removeEventListener(
        "mousedown",
        this.setLocalUidAdd,
        false
      );
    },
  },
  mounted() {
    // 获取 id 浏览记录
    this["getWorkHaveRead"] = this.pic.work.haveRead;
    // id 未浏览过 添加点击增加浏览 id 的绑定
    if (!this.pic.work.haveRead) {
      (this.$refs.pic as unknown as HTMLAnchorElement).addEventListener(
        "mousedown",
        this.setLocalIdAdd,
        false
      );
      (this.$refs.title as unknown as HTMLAnchorElement).addEventListener(
        "mousedown",
        this.setLocalIdAdd,
        false
      );
    }
    // 获取 uid 浏览记录
    this.getUserHaveRead = this.pic.user.haveRead;
    // uid 未浏览过 添加点击增加浏览 uid 的绑定
    if (!this.pic.user.haveRead) {
      (this.$refs.author as unknown as HTMLAnchorElement).addEventListener(
        "mousedown",
        this.setLocalUidAdd,
        false
      );
    }
  },
});
</script>

<style lang="scss" scoped>
.img {
  display: inline-flex;
  width: 15em;
  align-items: center;
  flex-direction: column;

  a {
    text-decoration: none;
  }

  .rank {
    margin: 0.3em 0;
    color: red;
    font-size: 1.5em;
    font-weight: bold;
  }

  .img-z {
    width: 100%;
    max-height: 40em;

    .page-c {
      height: 0;
      float: right;

      .page {
        float: right;
        width: 2em;
        height: 1em;
        background: chartreuse;
        color: red;
        font-size: 1.5em;
        font-weight: bold;
        text-align: center;
        border-radius: 50%;
        padding: 0.4em 0 0.6em 0;
        position: relative;
        top: 0.5em;
        right: 0.5em;
      }
    }
  }

  .title a,
  .user a {
    &.have-read {
      opacity: 0.2;
    }

    &:link {
      text-decoration: none;
    }

    &:visited,
    &:focus {
      opacity: 0.2;
    }

    &:hover {
      color: black;
      text-decoration: underline;
    }

    &:active {
      color: lightgray;
      text-decoration: none;
    }
  }

  .title {
    color: black;
    margin: 0.5em 0;
    font-weight: bold;
    font-size: 1.25em;
  }

  .user {
    color: blue;
    margin: 0;
    font-weight: bold;
    font-size: 1.2em;
  }
}
</style>
