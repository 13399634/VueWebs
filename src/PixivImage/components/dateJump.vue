<template>
  <div style="display: block" class="Day-Jump" hidden>
    <button class="db1" type="button" v-on:click="preview">
      <img v-bind:src="leftImg" alt="left" />
    </button>
    <button class="db2" type="button" v-on:click="next">
      <img v-bind:src="rightImg" alt="right" />
    </button>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "vue";
import { UrlParam } from "@/../Js/tools-getParam";
import { DateTime } from "@/../Js/tools-getDate";
import { ReLocal899Origin } from "@/../Js/PixivImage/urlRe";

let instance: ComponentInternalInstance | null;

export default defineComponent({
  name: "dateJump",
  computed: {
    // 图片链接 left
    leftImg: function (): string {
      return `${ReLocal899Origin}style/left.svg`;
    },
    // 图片链接 right
    rightImg: function (): string {
      return `${ReLocal899Origin}style/right.svg`;
    },
  },
  methods: {
    /**
     * @function
     * @description 快速跳转 +-日期
     * @see change_date_by_data_jump
     * @see change_date_by_data_jump_end
     */
    change_date_by_data_jump(time: number): void {
      // 获取日期
      let date: string | null = UrlParam.get("date");
      // 日期非空
      if (date === null) {
        return;
      }
      // 日期运算
      let next: string = DateTime.next(
        date.substring(0, 4),
        date.substring(4, 6),
        date.substring(6, 8),
        time
      );
      // 推送信息
      // date
      // date 日期
      instance!.proxy!.$NativeEventBus.emit("change_date_by_data_jump", next);
    },
    /**
     * @function
     * @description 日期退一天
     */
    preview(): void {
      this.change_date_by_data_jump(-1);
    },
    /**
     * @function
     * @description 日期进一天
     */
    next(): void {
      this.change_date_by_data_jump(+1);
    },
  },
  mounted(): void {
    instance = getCurrentInstance();
  },
});
</script>

<style lang="scss" scoped>
.Day-Jump {
  text-align: center;

  button {
    border: 0;
    padding: 0;
    background: rgba(0, 0, 0, 0);
  }

  img {
    min-width: 3em;
    min-height: 5em;
  }

  .db1,
  .db2 {
    position: fixed;
    top: 40%;
  }

  .db1 {
    left: 1em;
  }

  .db2 {
    right: 1em;
  }
}
</style>
