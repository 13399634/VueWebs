<template>
  <div class="pic">
    <a
      class="img"
      v-bind:href="url"
      target="_blank"
      v-on:click="handleFunction"
    >
      <div class="page" v-if="work.page !== 1">{{ work.page }}</div>
      <img v-bind:alt="work.id" v-bind:src="img_src" />
    </a>
    <p class="title" v-on:click="handleFunction" v-bind:class="work_class">
      <a v-bind:href="url" target="_blank">{{ work.title }}</a>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { RePximgOriginP } from "@/../Js/PixivImage/urlRe";
import { setLocalId } from "@/../Js/PixivImage/LocalDataRead";

// 作品数据
interface WorkType {
  // 作品id
  id: string;
  // 作品图片展示链接 small
  url: string;
  // 作品标题
  title: string;
  // 作品图片总数
  page: number;
  // 作品是否浏览过
  ex: boolean;
}

export default defineComponent({
  name: "authorContentItem",
  props: {
    // 作品数据
    work: {
      type: Object as PropType<WorkType>,
      required: true,
    },
  },
  data(): {
    // 插件中 储存 id 已读
    workHaveRead: boolean | null;
    handleFunction: () => void;
  } {
    // 获取 id 浏览记录
    let getWorkHaveRead = this.work.ex;
    let handleFunction: () => void;
    if (this.getWorkHaveRead) {
      handleFunction = this.voidFun as () => void;
    } else {
      // id 未浏览过 添加点击增加浏览 id 的绑定
      handleFunction = this.setLocalIdAdd as () => void;
    }
    return {
      workHaveRead: getWorkHaveRead,
      handleFunction: handleFunction,
    };
  },
  computed: {
    // id跳转链接
    url(): string {
      return `?id=${this.work.id}#/work`;
    },
    // 图片链接
    img_src(): string {
      return RePximgOriginP(this.work.url);
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
    // work class 读取状态
    work_class(): string {
      return this.getWorkHaveRead! ? "have-read" : "";
    },
  },
  methods: {
    // 空占用
    voidFun: (): void => undefined,
    /**
     * @function
     * @description 增加 id 浏览记录
     */
    setLocalIdAdd(): void {
      // 更新浏览 id 数据
      setLocalId(this.work.id);
      // 插件中 设置 id 已读
      this.getWorkHaveRead = true;
      // 占用绑定
      this.handleFunction = this.voidFun as () => void;
    },
  },
});
</script>

<style lang="scss" scoped>
//.pic-button-text {
//  text-align: center;
//}

.pic {
  width: 16em;
  display: inline-grid;
  margin: 0.5em;

  .img {
    width: 100%;

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
      top: 2.5em;
      right: 0.5em;
    }
  }

  .title {
    text-align: center;
    font-size: 1.2em;

    &.have-read {
      opacity: 0.2;
    }

    a {
      :link {
        color: black;
        text-decoration: none;
      }

      :visited,
      :focus {
        color: lightgray;
      }

      :hover {
        color: black;
        text-decoration: underline;
      }

      :active {
        color: lightgray;
        text-decoration: none;
      }
    }
  }
}
</style>
