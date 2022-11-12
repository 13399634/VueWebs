<template>
  <div class="arr-div" v-bind:class="divClass">
    <button v-bind:disabled="btnState" v-on:click="btnClickEvent">
      {{ btnPage }}
    </button>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  PropType,
} from "vue";
import { NavigationType } from "@/../Js/navigation";

let instance: ComponentInternalInstance | null;

export default defineComponent({
  name: "authorPageNavigationItem",
  props: {
    // 页面导航模型返回类型
    navigationType: {
      type: Number as PropType<NavigationType>,
      required: true,
    },
    // 页面
    page: {
      type: Number,
      required: false,
    },
  },
  data(): {
    // NavigationType 枚举类
    Navigation: unknown;
  } {
    return {
      Navigation: NavigationType,
    };
  },
  computed: {
    // div class
    divClass(): string {
      if (this.navigationType === NavigationType.placeholder) {
        return "void-space";
      } else if (this.navigationType === NavigationType.current) {
        return "current";
      } else if (this.navigationType === NavigationType.page) {
        return "page";
      } else {
        throw TypeError("");
      }
    },
    // button disabled 状态
    btnState(): boolean {
      // this.navigationType 等于 NavigationType.page disabled = "false"
      // this.navigationType 不等于 NavigationType.page disabled = "true"
      return this.navigationType !== NavigationType.page;
    },
    // button 内容content
    btnPage(): string {
      if (this.navigationType === NavigationType.placeholder) {
        return "···";
      } else {
        return this.page!.toString();
      }
    },
    /**
     * @function
     * @return {page_jump_by_author_page_navigation_item|voidFun} click 后触发的函数
     * @description 返回一个click后触发的函数
     */
    btnClickEvent(): () => void {
      if (this.navigationType === NavigationType.page) {
        // 页面跳转
        return this.page_jump_by_author_page_navigation_item;
      } else {
        // 空占用
        return this.voidFun;
      }
    },
  },
  methods: {
    // 空占用
    voidFun: (): void => undefined,
    /**
     * @function
     * @description 页面跳转
     * @see page_jump_by_author_page_navigation_item
     * @see page_jump_by_author_page_navigation_item_end_1
     * @see page_jump_by_author_page_navigation_item_end_2
     */
    page_jump_by_author_page_navigation_item(): void {
      // 页面跳转
      instance!.proxy!.$NativeEventBus.emit(
        "page_jump_by_author_page_navigation_item",
        // 页面
        this.page
      );
    },
  },
  mounted() {
    instance = getCurrentInstance();
  },
});
</script>

<style lang="scss" scoped>
.arr-div {
  display: inline-block;
  height: 100%;
  margin: 0 0.2em 0 0.2em;
  border-radius: 50%;

  &.page,
  &.current {
    width: 4em;
  }

  &.page {
    background: aqua;
  }

  &.void-space {
    width: 2em;
    background: white;
  }

  &.current {
    background: red;
  }

  button {
    border: 0;
    padding: 0;
    background: rgba(0, 0, 0, 0);
    height: 100%;
    width: 100%;
    color: black;
    font-size: 2em;
    font-weight: bold;
  }
}
</style>
