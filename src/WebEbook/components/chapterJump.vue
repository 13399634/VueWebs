<template>
  <p class="jump-chapter">
    <span class="jump-ns jump-preview">
      <label>
        <input
          type="button"
          v-on:click="jump_page_by_chapter_jump(-1)"
          v-bind:disabled="!jumpAble[0]"
        />
        上一章
      </label>
    </span>
    <span class="jump-home">
      <a v-bind:href="homeUrl" target="_self">目录</a>
    </span>
    <span class="jump-ns jump-next">
      <label>
        <input
          type="button"
          v-on:click="jump_page_by_chapter_jump(1)"
          v-bind:disabled="!jumpAble[1]"
        />
        下一章
      </label>
    </span>
  </p>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  PropType,
} from "vue";
import { bookUrl } from "@/../Js/WebEbook/routerPath";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "chapterJump",
  props: {
    // 书本id
    bid: {
      type: Number,
      required: true,
    },
    // 页面是否可跳转
    jumpAble: {
      type: Array as PropType<Array<boolean>>,
      required: true,
    },
  },
  data: function (): {
    // 页面是否可跳转
    homeUrl: string;
  } {
    return {
      homeUrl: bookUrl(this.bid),
    };
  },
  methods: {
    /**
     * @param process 页面跳转数量
     * @description 页面跳转
     * @see jump_page_by_chapter_jump
     * @see jump_page_by_chapter_jump_end
     */
    jump_page_by_chapter_jump: function (process: number): void {
      instance!.proxy!.$NativeEventBus.emit(
        "jump_page_by_chapter_jump",
        // 页面跳转数量
        process
      );
    },
  },
  mounted(): void {
    instance = getCurrentInstance();
  },
});
</script>

<style lang="scss" scoped>
.jump-chapter {
  text-align: center;
  font-size: 2em;

  .jump-ns input {
    border: 0;
    background: rgba(0, 0, 0, 0);
    font-size: 1em;
  }

  .jump-home {
    padding: 0 2.5em;

    a {
      color: black;
      text-decoration: none;
    }
  }
}
</style>
