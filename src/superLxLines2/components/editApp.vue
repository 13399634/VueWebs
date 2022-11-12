<template>
  <div
    v-if="page !== null"
    id="edit"
    v-bind:key="`edit-root-${page.page}`"
    ref="edit"
  >
    <div id="edit-top" ref="editTop">
      <edit-msg-info v-bind:tool="tool"></edit-msg-info>
      <div class="page-title-order">page-{{ page.page }}</div>
      <br />
      <edit-root-tool v-bind:tool="tool"></edit-root-tool>
      <br />
      <edit-line-top></edit-line-top>
    </div>
    <div id="edit-lines" ref="editLines">
      <edit-line
        v-for="(line, index) in page.content"
        v-bind:key="`edit-line-${page.page}-${line.id}`"
        v-bind:line="line"
        v-bind:tool="tool"
        v-bind:idx="index"
        v-bind:len="len"
      ></edit-line>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "vue";
import { ContentType, PageType } from "@/../Js/superLxLines2/page-type";
import { getPageSession } from "@/../Js/superLxLines2/session";
import { allowOverFlow } from "@/../Js/allowOverFlow";
import { throttle_ms } from "@/../Js/timeIn";
import { MsgLineColor } from "@/../Js/superLxLines2/msg-line-type";
import {
  change_lines_by_edit_line_type,
  enter_load_line_by_edit_line_type,
  merge_two_lines_by_edit_line_type,
  paste_lines_by_edit_line_type,
} from "@/../Js/superLxLines2/mitt-type";
import { class_arr, classMap } from "@/../Js/superLxLines2/edit-line-type";
// msg 输出
import EditMsgInfo from "@/superLxLines2/components/editMsgInfo.vue";
// 工具
import EditLineTop from "@/superLxLines2/components/editLineTop.vue";
// 段落 头部
import EditRootTool from "@/superLxLines2/components/editRootTool.vue";
// 段落
import EditLine from "@/superLxLines2/components/editLine.vue";
import { msgPush } from "../../../Js/superLxLines2/msg-push";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "EditRoot",
  components: { EditRootTool, EditLineTop, EditMsgInfo, EditLine },
  data(): {
    page: PageType;
    ide: number;
    tool: string;
  } {
    let page: PageType = JSON.parse(getPageSession()) as PageType;
    return {
      page: page,
      ide: page.content.length,
      tool: classMap[class_arr[0]],
    };
  },
  computed: {
    len(): number {
      return this.page.content.length;
    },
  },
  methods: {
    sizeControl: function (): void {
      allowOverFlow(
        this.$refs.editTop as HTMLElement,
        this.$refs.editLines as HTMLElement,
        this.$refs.edit as HTMLElement
      );
    },
    focus_idx(node: HTMLInputElement, index: number): void {
      node.focus();
      node.setSelectionRange(index, index);
    },

    /**
     * @see tool_change_by_edit_root_tool
     * @see tool_change_by_edit_root_tool_end
     */
    tool_change_by_edit_root_tool_end(): void {
      // 更改显示工具
      this.tool =
        class_arr[(class_arr.indexOf(this.tool) + 1) % class_arr.length];
    },
    /**
     * @see tool_change_by_edit_root_tool
     * @see tool_change_by_edit_root_tool_end
     */
    clean_space_line_all_by_edit_root_tool_end(): void {
      this.page.content = this.page.content.filter((line) => {
        // 过滤掉空格计数与内容为空的段落
        return !(line.space === 0 && line.content === "");
      });
    },
    /**
     * @see id_true_format_by_edit_root_tool
     * @see id_true_format_by_edit_root_tool_end
     */
    id_true_format_by_edit_root_tool_end() {
      let c = this.page.content;
      for (let i = 0; i < c.length; i++) {
        c[i].id = i;
      }
      msgPush(
        instance,
        MsgLineColor.green,
        `所有的ID均已序列化，id顺序0-${c.length}`
      );
    },
    post_server_data_by_edit_root(ev: Event): void {
      if (throttle_ms(this.post_server_data_by_edit_root, 3000)) {
        ev.preventDefault();
        ev.stopPropagation();
        msgPush(instance, MsgLineColor.red, `请求繁忙, 请3s后再次请求`);
      } else {
        this.id_true_format_by_edit_root_tool_end();
        // page
        // instance!.proxy!.$NativeEventBus.emit("post_server_data_by_edit_root", this.page);
      }
    },
    give_up_page_by_edit_root_tool_end_1_2(): void {
      // this.show = false;
    },
    view_content_by_edit_root(): void {
      this.id_true_format_by_edit_root_tool_end();
      // page
      // instance!.proxy!.$NativeEventBus.emit("view_content_by_edit_root", this.page);
      // this.show = false;
    },

    post_server_data_then_view_by_edit_root(): void {
      this.id_true_format_by_edit_root_tool_end();
      // page
      // instance!.proxy!.$NativeEventBus.emit(
      //   "post_server_data_then_view_by_edit_root",
      //   this.page
      // );
      // this.show = false;
    },

    /**
     * @see paste_lines_by_edit_line
     * @see paste_lines_by_edit_line_end
     */
    paste_lines_by_edit_line_end(param: unknown): void {
      // input内容选取首位坐标
      let res: paste_lines_by_edit_line_type =
        param as paste_lines_by_edit_line_type;
      // index
      let index: number = res.index;
      // input内容选取首位坐标
      let selection: [number, number] = res.selectionStartEndOrder;
      // 粘贴数据
      let text: string = res.text;
      // 当前行数据
      let ic: ContentType = this.page.content[index];
      // 粘贴数据分行
      let lines: string[] = text.split("\n");
      // ide服务msg
      let lastId: number = this.ide!;
      // 所有行内容重改
      this.page.content = this.page.content
        .slice(0, index + 1)
        // 粘贴数据生成多行
        .concat(
          // 粘贴数据枚举
          lines.map((line: string) => {
            // 一行粘贴数据去首空格
            let ltl: string = line.trimStart();
            // 类型
            let type: number;
            // 首空格计数
            let space: number = line.length - ltl.length;
            // 是否是注释行
            if (ltl.slice(0, 3) === "// ") {
              ltl = ltl.slice(3);
              type = 1;
            } else {
              type = 0;
            }
            return {
              id: this.ide!++,
              content: ltl,
              space: space,
              type: type,
            };
          })
        )
        // 新增一行
        .concat({
          id: this.ide!++,
          content: ic.content.slice(selection[1]),
          space: ic.space,
          type: ic.type,
        })
        .concat(this.page.content.slice(index + 2));
      ic.content = ic.content.slice(0, selection[0]);
      this.$nextTick(() => {
        let editLines: HTMLInputElement = this.$refs
          .editLines as HTMLInputElement;
        let coreInput: HTMLInputElement = editLines.children![
          index + lines.length + 1
        ].lastElementChild!.firstElementChild as HTMLInputElement;
        this.focus_idx(coreInput, 0);
      });
      msgPush(
        instance,
        MsgLineColor.green,
        `paste 新建ids: ${lastId} - ${this.ide - 1}`
      );
    },
    /**
     * @see enter_load_line_by_edit_line
     * @see enter_load_line_by_edit_line_end
     */
    enter_load_line_by_edit_line_end(param: unknown): void {
      let enter_load_line_by_edit_line: enter_load_line_by_edit_line_type =
        param as enter_load_line_by_edit_line_type;
      // input内容选取首位坐标
      let selectionStartEndOrder: [number, number] =
        enter_load_line_by_edit_line.selectionStartEndOrder;
      // index
      let idx: number = enter_load_line_by_edit_line.index;
      // 当前行根节点
      let currentLine: HTMLDivElement =
        enter_load_line_by_edit_line.currentLine;
      // 当前行数据
      let line = this.page.content[idx];
      // 新增一行数据
      this.page.content.splice(idx + 1, 0, {
        id: this.ide!++,
        content: line.content.slice(selectionStartEndOrder[1]),
        space: line.space,
        type: line.type,
      });
      // 本行数据选取裁剪
      line.content = line.content.slice(0, selectionStartEndOrder[0]);
      // 选取聚焦
      this.$nextTick(() =>
        this.focus_idx(
          currentLine.nextElementSibling!.lastElementChild!
            .firstElementChild as HTMLInputElement,
          0
        )
      );
      msgPush(instance, MsgLineColor.green, `enter 新建id: ${this.ide}`);
    },

    /**
     * @see paste_lines_by_edit_line
     * @see change_lines_by_edit_line_end
     */
    change_lines_by_edit_line_end: function (param: unknown): void {
      // input内容选取首位坐标
      let res: change_lines_by_edit_line_type =
        param as change_lines_by_edit_line_type;
      // index
      let index: number = res.index;
      // input内容选取首位坐标
      let selection: [number, number] = res.selectionStartEndOrder;
      // 粘贴数据
      let text: string = res.text;
      // 获取当前行内容
      let content = this.page.content[index].content;
      // 当前行内容更改
      this.page.content[index].content = `${content.slice(
        0,
        selection[0]
      )}${text}${content.slice(selection[1])}`;
    },
    /**
     * @see merge_two_lines_by_edit_line
     * @see merge_two_lines_by_edit_line_end
     */
    merge_two_lines_by_edit_line_end(param: unknown) {
      let merge_two_lines_by_edit_line: merge_two_lines_by_edit_line_type =
        param as merge_two_lines_by_edit_line_type;
      // index
      let idx: number = merge_two_lines_by_edit_line.index;
      // 当前行根节点
      let currentLine: HTMLDivElement =
        merge_two_lines_by_edit_line.currentLine;
      // 所有段落数据
      let content = this.page.content;
      // 上一个段落数据
      let idx1 = content[idx - 1];
      // 当前段落数据
      let idx0 = content[idx];
      // 段落数据类型一致
      if (idx1.type === idx0.type) {
        // 上一个段落input节点
        let coreInput: HTMLInputElement = currentLine.previousElementSibling!
          .lastElementChild!.firstElementChild as HTMLInputElement;
        // 上一个段落数据 内容长度
        let idc = idx1.content.length;
        msgPush(
          instance,
          MsgLineColor.green,
          `delete 合并id${idx0.id}到id${idx1.id}`
        );
        // 上一个段落数据 内容更改
        idx1.content = idx1.content + idx0.content;
        // 删除本行
        content.splice(idx, 1);
        // 聚焦到上行
        this.$nextTick(() => this.focus_idx(coreInput, idc));
      }
    },

    /**
     * @see change_type_by_edit_line
     * @see change_type_by_edit_line_end
     */
    change_type_by_edit_line_end(param: unknown) {
      // index
      let idx: number = param as number;
      // 当前行数据
      let line = this.page.content[idx];
      // 更改当前行类型
      line.type = (line.type + 1) % class_arr.length;
    },
    /**
     * @see delete_line_by_edit_line
     * @see delete_line_by_edit_line_end
     */
    delete_line_by_edit_line_end(param: unknown) {
      // index
      let idx: number = param as number;
      msgPush(
        instance,
        MsgLineColor.green,
        `delete 删除id: ${this.page.content[idx].id}`
      );
      // 删除本行
      this.page.content.splice(idx, 1);
      // 一行都没有
      if (this.page.content.length === 0) {
        msgPush(
          instance,
          MsgLineColor.green,
          `delete 无id存在 新建id: ${this.ide}`
        );
        // 生成新行
        this.page.content.push({
          id: this.ide++,
          content: "",
          space: 0,
          type: 0,
        });
      }
    },
    // space_change_line_by_edit_line_end(idx, value) {
    //   // idx value
    //   this.page.content[idx].space = value;
    // },
    // content_change_line_by_edit_line_end(idx, value) {
    //   // idx value
    //   this.page.content[idx].content = value;
    // },
    //
    // edit_open_by_view_page_end_2_2(page) {
    //   // edit.page
    //   this.page = page;
    //   this.show = true;
    // },
    // new_open_by_view_root_end(page) {
    //   // edit.page
    //   this.edit_open_by_view_page_end_2_2(page);
    // },
    //
    /**
     * @see left_index_focus
     * @see left_index_focus_by_edit_line_end
     */
    left_index_focus_by_edit_line_end(param: unknown) {
      // index
      let idx: number = param as number;
      // 聚焦上一行段尾
      this.focus_idx(
        (this.$refs.editLines as HTMLDivElement).children[idx - 1]!
          .lastElementChild!.firstElementChild as HTMLInputElement,
        this.page.content[idx - 1].content.length
      );
    },
  },
  // watch: {
  //   show: {
  //     immediate: true,
  //     handler(newName, oldName) {
  //       if (newName === true && (oldName === false || oldName === undefined)) {
  //         window.addEventListener("resize", this.sizeControl, false);
  //         this.ide = this.page.content.length;
  //         this.$nextTick(() => {
  //           // instance!.proxy!.$NativeEventBus.emit("from_edit_msg_info_listen_clean_cmd");
  //           this.sizeControl();
  //         });
  //       } else if (newName === false && oldName === true) {
  //         window.removeEventListener("resize", this.sizeControl, false);
  //       }
  //     },
  //   },
  // },
  mounted() {
    instance = getCurrentInstance();
    instance!.proxy!.$NativeEventBus.on(
      "change_lines_by_edit_line",
      this.change_lines_by_edit_line_end
    );
    // this.NativeEventBus.$on(
    //   "tool_change_by_edit_root_tool",
    //   this.tool_change_by_edit_root_tool_end
    // );
    // this.NativeEventBus.$on(
    //   "clean_space_line_all_by_edit_root_tool",
    //   this.clean_space_line_all_by_edit_root_tool_end
    // );
    // this.NativeEventBus.$on(
    //   "id_true_format_by_edit_root_tool",
    //   this.id_true_format_by_edit_root_tool_end
    // );
    // this.NativeEventBus.$on(
    //   "post_server_data_by_edit_root_tool",
    //   this.post_server_data_by_edit_root
    // );
    // this.NativeEventBus.$on(
    //   "give_up_page_by_edit_root_tool",
    //   this.give_up_page_by_edit_root_tool_end_1_2
    // );
    // this.NativeEventBus.$on(
    //   "view_content_by_edit_root_tool",
    //   this.view_content_by_edit_root
    // );
    // this.NativeEventBus.$on(
    //   "post_server_data_then_view_by_edit_root_tool",
    //   this.post_server_data_then_view_by_edit_root
    // );
    //
    // this.NativeEventBus.$on(
    //   "enter_load_line_by_edit_line",
    //   this.enter_load_line_by_edit_line_end
    // );
    // this.NativeEventBus.$on(
    //   "merge_two_lines_by_edit_line",
    //   this.merge_two_lines_by_edit_line_end
    // );
    //
    // this.NativeEventBus.$on(
    //   "edit_open_by_view_page",
    //   this.edit_open_by_view_page_end_2_2
    // );
    // this.NativeEventBus.$on(
    //   "new_open_by_view_root",
    //   this.new_open_by_view_root_end
    // );
    // this.NativeEventBus.$on(
    //   "paste_lines_by_edit_line",
    //   this.paste_lines_by_edit_line_end
    // );
    //
    // this.NativeEventBus.$on(
    //   "change_type_by_edit_line",
    //   this.change_type_by_edit_line_end
    // );
    // this.NativeEventBus.$on(
    //   "delete_line_by_edit_line",
    //   this.delete_line_by_edit_line_end
    // );
    // this.NativeEventBus.$on(
    //   "space_change_line_by_edit_line",
    //   this.space_change_line_by_edit_line_end
    // );
    // this.NativeEventBus.$on(
    //   "content_change_line_by_edit_line",
    //   this.content_change_line_by_edit_line_end
    // );
    //
    // this.NativeEventBus.$on(
    //   "left_index_focus_by_edit_line",
    //   this.left_index_focus_by_edit_line_end
    // );
  },
  beforeUnmount() {
    // this.NativeEventBus.$off(
    //   "tool_change_by_edit_root_tool",
    //   this.tool_change_by_edit_root_tool_end
    // );
    // this.NativeEventBus.$off(
    //   "clean_space_line_all_by_edit_root_tool",
    //   this.clean_space_line_all_by_edit_root_tool_end
    // );
    // this.NativeEventBus.$off(
    //   "id_true_format_by_edit_root_tool",
    //   this.id_true_format_by_edit_root_tool_end
    // );
    // this.NativeEventBus.$off(
    //   "post_server_data_by_edit_root_tool",
    //   this.post_server_data_by_edit_root
    // );
    // this.NativeEventBus.$off(
    //   "give_up_page_by_edit_root_tool",
    //   this.give_up_page_by_edit_root_tool_end_1_2
    // );
    // this.NativeEventBus.$off(
    //   "view_content_by_edit_root_tool",
    //   this.view_content_by_edit_root
    // );
    // this.NativeEventBus.$off(
    //   "post_server_data_then_view_by_edit_root_tool",
    //   this.post_server_data_then_view_by_edit_root
    // );
    //
    // this.NativeEventBus.$off(
    //   "enter_load_line_by_edit_line",
    //   this.enter_load_line_by_edit_line_end
    // );
    // this.NativeEventBus.$off(
    //   "merge_two_lines_by_edit_line",
    //   this.merge_two_lines_by_edit_line_end
    // );
    //
    // this.NativeEventBus.$off(
    //   "edit_open_by_view_page",
    //   this.edit_open_by_view_page_end_2_2
    // );
    // this.NativeEventBus.$off(
    //   "new_open_by_view_root",
    //   this.new_open_by_view_root_end
    // );
    // this.NativeEventBus.$off(
    //   "paste_lines_by_edit_line",
    //   this.paste_lines_by_edit_line_end
    // );
    //
    // this.NativeEventBus.$off(
    //   "change_type_by_edit_line",
    //   this.change_type_by_edit_line_end
    // );
    // this.NativeEventBus.$off(
    //   "delete_line_by_edit_line",
    //   this.delete_line_by_edit_line_end
    // );
    // this.NativeEventBus.$off(
    //   "space_change_line_by_edit_line",
    //   this.space_change_line_by_edit_line_end
    // );
    // this.NativeEventBus.$off(
    //   "content_change_line_by_edit_line",
    //   this.content_change_line_by_edit_line_end
    // );
    //
    // this.NativeEventBus.$off(
    //   "left_index_focus_by_edit_line",
    //   this.left_index_focus_by_edit_line_end
    // );
  },
});
</script>

<style lang="scss" scoped>
#edit-top {
  background: papayawhip;

  .page-title-order {
    text-decoration: none;
    color: black;
    font-size: 1.6em;
    font-weight: bold;
    margin: 0.5em 0 0.8em 0;
    display: inline-block;
  }
}

#edit-lines {
  overflow: auto;
}
</style>
