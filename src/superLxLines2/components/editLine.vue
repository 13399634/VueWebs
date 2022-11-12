<template>
  <div
    class="line"
    v-bind:class="lineClass"
    v-bind:data-id="line.id"
    ref="currentLine"
  >
    <button type="button" class="type" v-on:click="change_type_by_edit_line">
      {{ line.type }}
    </button>
    <label class="space" v-if="tool === 'space'">
      <input v-model.number.lazy="space" type="number" />
    </label>
    <label class="cancel" v-else-if="tool === 'cancel'">
      <img
        alt="cancel"
        v-bind:src="`${stylePath}superLxLines/delete.svg`"
        v-on:click="delete_line_by_edit_line"
      />
    </label>
    <label
      class="content"
      v-on:paste.stop.prevent="paste_lines_by_edit_line"
      v-on:keydown.up.stop.prevent="up_index_focus"
      v-on:keydown.down.stop.prevent="down_index_focus"
      v-on:keydown.left="left_index_focus"
      v-on:keydown.right="right_index_focus"
      v-on:keyup.up.stop.prevent
      v-on:keyup.down.stop.prevent
      v-on:keyup.left.stop.prevent
      v-on:keyup.right.stop.prevent
      v-on:keydown.enter.stop.prevent="enter_load_line_by_edit_line"
      v-on:keydown.delete="merge_two_lines_by_edit_line"
      v-on:keyup.enter.stop.prevent
      v-on:keyup.delete.stop.prevent
    >
      <input v-model="content" type="text" ref="coreInput" />
    </label>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  PropType,
} from "vue";
import "@/../Js/stringReplace";
import { focus_idx } from "@/../Js/focus";
import { getStartEndOrder } from "@/../Js/StartEndOrder";
import { throttle_ms } from "@/../Js/timeIn";
import { class_arr, classMap } from "@/../Js/superLxLines2/edit-line-type";
import {
  change_lines_by_edit_line_type,
  enter_load_line_by_edit_line_type,
  merge_two_lines_by_edit_line_type,
  paste_lines_by_edit_line_type,
} from "@/../Js/superLxLines2/mitt-type";
import {
  MsgLineColor,
  MsgLineTransmitInfo,
} from "@/../Js/superLxLines2/msg-line-type";
import { ContentType } from "@/../Js/superLxLines2/page-type";
import { ReLocal899Origin } from "@/../Js/superLxLines2/urlRe";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "editLine",
  props: {
    // 当前编辑行的所有数据
    line: {
      type: Object as PropType<ContentType>,
      required: true,
    },
    idx: {
      type: Number,
      required: true,
    },
    len: {
      type: Number,
      required: true,
    },
    tool: {
      type: String,
      required: true,
    },
  },
  computed: {
    // 当前编辑行内容前的空格
    space: {
      set: function (value: number) {
        if (value !== this.line.space) {
          // idx value
          // this.NativeEventBus.$emit(
          //   "space_change_line_by_edit_line",
          //   this.idx,
          //   value
          // );
        }
      },
      get: function (): number {
        return this.line.space;
      },
    },
    // 当前编辑行的内容
    content: {
      set: function (value: string): void {
        if (value !== this.line.content) {
          // idx value
          // this.NativeEventBus.$emit(
          //   "content_change_line_by_edit_line",
          //   this.idx,
          //   value
          // );
        }
      },
      get: function (): string {
        return this.line.content;
      },
    },
    // 当前编辑行的类型
    lineClass: function (): string {
      return classMap[class_arr[this.line.type]];
    },
    // localhost:899 style目录
    stylePath: function (): string {
      return `${ReLocal899Origin}style/`;
    },
  },
  methods: {
    /**
     * @function
     * @return {[number, number]} input内容选取首尾坐标
     * @description 获取input内容选取首尾坐标
     */
    getSelectionStartEndOrder: function (): [number, number] {
      return getStartEndOrder(
        (this.$refs.coreInput as HTMLInputElement).selectionStart!,
        (this.$refs.coreInput as HTMLInputElement).selectionEnd!
      );
    },

    /**
     * @function
     * @param ev {ClipboardEvent} 事件
     * @description 粘贴控制
     * @see paste_lines_by_edit_line
     * @see paste_lines_by_edit_line_end
     * @see change_lines_by_edit_line_end
     */
    paste_lines_by_edit_line: function (ev: ClipboardEvent): void {
      // 粘贴字符串
      let text: string = ev.clipboardData!.getData("Text");
      // 非空
      if (text === "") {
        return;
      }
      // 换行符转化
      text = text.stringReplaceC2("\r\n", "\n").stringReplaceC1("\r", "\n");
      // 作用节点
      let target: HTMLInputElement = this.$refs.coreInput as HTMLInputElement;
      // 获取input内容选取首位坐标
      let selectionStartEndOrder: [number, number] =
        this.getSelectionStartEndOrder();
      let change_lines_by_edit_line: change_lines_by_edit_line_type = {
        // input内容选取首位坐标
        selectionStartEndOrder: selectionStartEndOrder,
        // index
        index: this.idx,
        // input内容
        text: text,
      };
      if (text.indexOf("\n") === -1) {
        // 仅作用于单行
        instance!.proxy!.$NativeEventBus.emit(
          "change_lines_by_edit_line",
          change_lines_by_edit_line
        );
        // 选取聚焦
        this.$nextTick(() => {
          focus_idx(target, selectionStartEndOrder[0] + text.length);
        });
        let transmit: MsgLineTransmitInfo = {
          color: MsgLineColor.green,
          info: `paste 更新id: ${this.line.id}`,
        };
        /**
         * @see from_edit_msg_info_listen_add_msg
         */
        // msg 推送 粘贴成功
        instance!.proxy!.$NativeEventBus.emit(
          "from_edit_msg_info_listen_add_msg",
          transmit
        );
      } else {
        let paste_lines_by_edit_line: paste_lines_by_edit_line_type =
          change_lines_by_edit_line;
        instance!.proxy!.$NativeEventBus.emit(
          "paste_lines_by_edit_line",
          paste_lines_by_edit_line
        );
      }
    },
    /**
     * @function
     * @description enter事件 加载新一行
     * @see enter_load_line_by_edit_line
     * @see enter_load_line_by_edit_line_end
     */
    enter_load_line_by_edit_line: function () {
      if (throttle_ms(this.enter_load_line_by_edit_line)) {
        return;
      }
      let enter_load_line_by_edit_line: enter_load_line_by_edit_line_type = {
        // input内容选取首位坐标
        selectionStartEndOrder: this.getSelectionStartEndOrder(),
        // index
        index: this.idx,
        // 当前行根节点
        currentLine: this.$refs.currentLine as HTMLDivElement,
      };
      instance!.proxy!.$NativeEventBus.emit(
        "enter_load_line_by_edit_line",
        enter_load_line_by_edit_line
      );
    },
    /**
     * @function
     * @param ev {KeyboardEvent} 事件
     * @description delete事件 融合两行
     * @see merge_two_lines_by_edit_line
     * @see merge_two_lines_by_edit_line_end
     */
    merge_two_lines_by_edit_line: function (ev: KeyboardEvent) {
      if (throttle_ms(this.merge_two_lines_by_edit_line)) {
        ev.preventDefault();
        ev.stopPropagation();
        return;
      }
      if (ev.key === "Backspace") {
        // 获取input内容选取首位坐标
        let selection: [number, number] = this.getSelectionStartEndOrder();
        // start
        let s0: number = selection[0];
        // end
        let s1: number = selection[1];
        if (s0 === s1 && s0 === 0 && this.idx !== 0) {
          ev.preventDefault();
          ev.stopPropagation();
          let merge_two_lines_by_edit_line: merge_two_lines_by_edit_line_type =
            {
              // index
              index: this.idx,
              // 当前行根节点
              currentLine: this.$refs.currentLine as HTMLDivElement,
            };
          instance!.proxy!.$NativeEventBus.emit(
            "merge_two_lines_by_edit_line",
            merge_two_lines_by_edit_line
          );
        }
      }
    },

    /**
     * @function
     * @description 更改行类型
     * @see change_type_by_edit_line
     * @see change_type_by_edit_line_end
     */
    change_type_by_edit_line: function () {
      // idx
      instance!.proxy!.$NativeEventBus.emit(
        "change_type_by_edit_line",
        this.idx
      );
    },
    /**
     * @function
     * @description 删除行
     * @see delete_line_by_edit_line
     * @see delete_line_by_edit_line_end
     */
    delete_line_by_edit_line: function () {
      instance!.proxy!.$NativeEventBus.emit(
        "delete_line_by_edit_line",
        this.idx
      );
    },

    /**
     * @function
     * @description ↑键跨行移动
     */
    up_index_focus: function () {
      // 非首行
      if (throttle_ms(this.up_index_focus, 30) || this.idx === 0) {
        return;
      }
      // 前一行跳转
      focus_idx(
        (this.$refs.currentLine as HTMLDivElement).previousElementSibling!
          .lastElementChild!.firstElementChild as HTMLInputElement,
        this.getSelectionStartEndOrder()[0]
      );
    },
    /**
     * @function
     * @description ↓键跨行移动← →
     */
    down_index_focus: function () {
      // 非尾行
      if (throttle_ms(this.down_index_focus, 30) || this.idx === this.len - 1) {
        return;
      }
      // 后一行跳转
      focus_idx(
        (this.$refs.currentLine as HTMLDivElement).nextElementSibling!
          .lastElementChild!.firstElementChild as HTMLInputElement,
        this.getSelectionStartEndOrder()[0]
      );
    },
    /**
     * @function
     * @description ←键跨行移动
     * @see left_index_focus
     * @see left_index_focus_by_edit_line_end
     */
    left_index_focus: function (ev: KeyboardEvent) {
      if (throttle_ms(this.left_index_focus, 30)) {
        ev.preventDefault();
        ev.stopPropagation();
        return;
      }
      // 获取input内容选取首尾坐标
      let selection: [number, number] = this.getSelectionStartEndOrder();
      // start
      let s0: number = selection[0];
      // end
      let s1: number = selection[1];
      if (
        // 非首行
        this.idx !== 0 &&
        // 首尾坐标一致
        s0 === s1 &&
        // 段落头部
        s0 === 0
      ) {
        ev.preventDefault();
        ev.stopPropagation();
        // 下一行行首
        instance!.proxy!.$NativeEventBus.emit(
          "left_index_focus_by_edit_line",
          this.idx
        );
      }
    },
    /**
     * @function
     * @description →键跨行移动
     */
    right_index_focus: function (ev: KeyboardEvent) {
      if (throttle_ms(this.right_index_focus, 30)) {
        ev.preventDefault();
        ev.stopPropagation();
        return;
      }
      // 获取input内容选取首尾坐标
      let selection: [number, number] = this.getSelectionStartEndOrder();
      // start
      let s0: number = selection[0];
      // end
      let s1: number = selection[1];
      if (
        // 非尾行
        this.idx !== this.len - 1 &&
        // 首尾坐标一致
        s0 === s1 &&
        // 段落尾部
        s1 === this.line.content.length
      ) {
        ev.preventDefault();
        ev.stopPropagation();
        // 下一行行首
        focus_idx(
          (this.$refs.currentLine as HTMLDivElement).nextElementSibling!
            .lastElementChild!.firstElementChild! as HTMLInputElement,
          0
        );
      }
    },
  },
  mounted: function (): void {
    instance = getCurrentInstance();
  },
});
</script>

<style lang="scss" scoped>
input {
  background: rgba(0, 0, 0, 0);
  border: 0;
  padding: 0;
  width: 100%;
  white-space: pre;
  border-bottom: 1px solid black;
  font-size: 1.2em;

  &:focus {
    outline: none;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }

  &::-webkit-calendar-picker-indicator,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
}

.code {
  input {
    border-bottom-color: blueviolet;
  }
}

.notes {
  input {
    border-bottom-color: slategrey;
    color: slategrey;
    font-weight: bold;
  }
}

.line {
  display: list-item;
  list-style: decimal;
  margin-left: 4em;

  .type {
    width: 2em;
    background: rgba(0, 0, 0, 0);
    font-size: 1.2em;
    border: 0;
    border-right: 2px solid black;
  }

  .space {
    display: inline-block;
    width: 2em;
  }

  .cancel {
    display: inline-block;
    width: 2em;
    height: 1em;

    input {
      width: 100%;
      border: 0;
      opacity: 0;
    }

    img {
      display: block;
      width: 2em;
      height: 1.5em;
    }
  }

  .content {
    display: inline-block;
    width: 36em;
  }
}
</style>
