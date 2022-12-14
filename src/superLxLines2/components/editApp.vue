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
import superagent from "superagent";
import { allowOverFlow } from "@/../Js/allowOverFlow";
import { ContentType, PageType } from "@/../Js/superLxLines2/page-type";
import {
  delEditSession,
  getPageSession,
  getPagesSession,
  pushViewSession,
} from "@/../Js/superLxLines2/session";
import { MsgLineColor } from "@/../Js/superLxLines2/msg-line-type";
import {
  change_lines_by_edit_line_type,
  content_change_line_by_edit_line_type,
  enter_load_line_by_edit_line_type,
  merge_two_lines_by_edit_line_type,
  paste_lines_by_edit_line_type,
  space_change_line_by_edit_line_type,
} from "@/../Js/superLxLines2/mitt-type";
import { class_arr } from "@/../Js/superLxLines2/edit-line-type";
import { msgPush } from "@/../Js/superLxLines2/msg-push";
import { ReLocal899Origin } from "@/../Js/superLxLines2/urlRe";
import router from "@/superLxLines2/router";
// msg 输出
import EditMsgInfo from "@/superLxLines2/components/editMsgInfo.vue";
// 工具
import EditLineTop from "@/superLxLines2/components/editLineTop.vue";
// 段落 头部
import EditRootTool from "@/superLxLines2/components/editRootTool.vue";
// 段落
import EditLine from "@/superLxLines2/components/editLine.vue";
import { focus_idx } from "@/../Js/focus";
import { tool_arr, toolMap } from "@/../Js/superLxLines2/edit-tool-type";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "EditRoot",
  components: { EditRootTool, EditLineTop, EditMsgInfo, EditLine },
  props: {
    rName: {
      type: String,
      required: true,
    },
  },
  data(): {
    page: PageType;
    ide: number;
    tool: toolMap;
  } {
    let page: PageType = JSON.parse(getPageSession()) as PageType;
    return {
      page: page,
      ide: page.content.length,
      tool: toolMap[tool_arr[0]],
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

    /**
     * @function
     * @description 跳转到预览页面
     */
    view_jump: function () {
      router.push({ path: "view", query: this.$route.query });
    },

    /**
     * @see tool_change_by_edit_root_tool
     * @see tool_change_by_edit_root_tool_end
     */
    tool_change_by_edit_root_tool_end(): void {
      // 更改显示工具
      this.tool = tool_arr[(tool_arr.indexOf(this.tool) + 1) % tool_arr.length];
    },
    /**
     * @see clean_space_line_all_by_edit_root_tool
     * @see clean_space_line_all_by_edit_root_tool_end
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
    id_true_format_by_edit_root_tool_end(): void {
      // 页面所有段落
      let c = this.page.content;
      for (let i = 0; i < c.length; i++) {
        // id 匹配 index
        c[i].id = i;
      }
      msgPush(
        instance,
        MsgLineColor.green,
        `所有的ID均已序列化，id顺序0-${c.length}`
      );
    },
    /**
     * @function
     * @param service {boolean} default true 推送数据到服务器 false 不推送数据到服务器
     * @param session {boolean} default true 推送数据到sessionStorage false 不推送数据到sessionStorage
     * @description 更新所有页面数据并推送到服务器和sessionStorage
     */
    post_server_data(service = true, session = true): void {
      // 段落id与index重新关联
      this.id_true_format_by_edit_root_tool_end();
      // 所有页面数据
      let pages: Array<PageType> = JSON.parse(
        getPagesSession()
      ) as Array<PageType>;
      // 本页面数据index
      let index: number = this.page.id;
      // 本页面数据index 等于 所有页面总数
      if (pages.length === index) {
        // 新增页面
        pages.push(this.page);
      } else {
        // 更新页面
        pages[index] = this.page;
      }
      // 所有页面数据 json格式
      let pagesJson: string = JSON.stringify(pages);
      // 所有页面数据 推送到服务器
      if (service) {
        superagent
          .post(`${ReLocal899Origin}data/ajax/write.json`)
          .set("Content-Type", "application/json;charset=utf-8")
          .type("form")
          .send({
            json: JSON.stringify([pagesJson]),
            name: this.rName,
            type: 5,
          })
          .end();
      }
      if (session) {
        // 所有页面数据 推送到sessionStorage
        pushViewSession(pagesJson);
      }
    },
    /**
     * @see post_server_data_by_edit_root_tool
     * @see post_server_data_by_edit_root_tool_end
     */
    post_server_data_by_edit_root_tool_end(): void {
      // 更新所有页面数据并推送到服务器和sessionStorage
      this.post_server_data();
    },
    /**
     * @see give_up_page_by_edit_root_tool
     * @see give_up_page_by_edit_root_tool_end
     */
    give_up_page_by_edit_root_tool_end(): void {
      // 消除sessionStorage中的正在编辑的数据数据
      delEditSession();
      // 跳转到预览页面
      this.view_jump();
    },
    /**
     * @see view_content_by_edit_root_tool
     * @see view_content_by_edit_root_tool_end
     */
    view_content_by_edit_root_tool_end(): void {
      // 更新所有页面数据并推送到sessionStorage
      this.post_server_data(false, true);
      // 跳转到预览页面
      this.view_jump();
    },
    /**
     * @see post_server_data_then_view_by_edit_root_tool
     * @see post_server_data_then_view_by_edit_root_tool_end
     */
    post_server_data_then_view_by_edit_root_tool_end(): void {
      // 更新所有页面数据并推送到服务器和sessionStorage
      this.post_server_data();
      // 跳转到预览页面
      this.view_jump();
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
      let lines: Array<string> = text.split("\n");
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
        focus_idx(coreInput, 0);
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
        focus_idx(
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
    merge_two_lines_by_edit_line_end(param: unknown): void {
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
        this.$nextTick(() => focus_idx(coreInput, idc));
      }
    },

    /**
     * @see change_type_by_edit_line
     * @see change_type_by_edit_line_end
     */
    change_type_by_edit_line_end(param: unknown): void {
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
    delete_line_by_edit_line_end(param: unknown): void {
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
    /**
     * @see space_change_line_by_edit_line_end
     */
    space_change_line_by_edit_line_end(param: unknown): void {
      let mitt: space_change_line_by_edit_line_type =
        param as space_change_line_by_edit_line_type;
      // 空格计数
      let space: number = mitt.space;
      // index
      let idx: number = mitt.index;
      // idx value
      this.page.content[idx].space = space;
    },
    /**
     * @see content_change_line_by_edit_line_end
     */
    content_change_line_by_edit_line_end(param: unknown): void {
      let mitt: content_change_line_by_edit_line_type =
        param as content_change_line_by_edit_line_type;
      // coreInput内容
      let content: string = mitt.content;
      // index
      let idx: number = mitt.index;
      this.page.content[idx].content = content;
    },
    /**
     * @see left_index_focus
     * @see left_index_focus_by_edit_line_end
     */
    left_index_focus_by_edit_line_end(param: unknown): void {
      // index
      let idx: number = param as number;
      // 聚焦上一行段尾
      focus_idx(
        (this.$refs.editLines as HTMLDivElement).children[idx - 1]!
          .lastElementChild!.firstElementChild as HTMLInputElement,
        this.page.content[idx - 1].content.length
      );
    },
  },
  mounted(): void {
    window.addEventListener("resize", this.sizeControl, false);
    this.$nextTick(() => {
      this.sizeControl();
      instance!.proxy!.$NativeEventBus.emit(
        "from_edit_msg_info_listen_clean_cmd"
      );
    });
    instance = getCurrentInstance();
    instance!.proxy!.$NativeEventBus.on(
      "change_lines_by_edit_line",
      this.change_lines_by_edit_line_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "tool_change_by_edit_root_tool",
      this.tool_change_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "clean_space_line_all_by_edit_root_tool",
      this.clean_space_line_all_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "id_true_format_by_edit_root_tool",
      this.id_true_format_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "post_server_data_by_edit_root_tool",
      this.post_server_data_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "give_up_page_by_edit_root_tool",
      this.give_up_page_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "view_content_by_edit_root_tool",
      this.view_content_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "post_server_data_then_view_by_edit_root_tool",
      this.post_server_data_then_view_by_edit_root_tool_end
    );

    instance!.proxy!.$NativeEventBus.on(
      "enter_load_line_by_edit_line",
      this.enter_load_line_by_edit_line_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "merge_two_lines_by_edit_line",
      this.merge_two_lines_by_edit_line_end
    );

    instance!.proxy!.$NativeEventBus.on(
      "paste_lines_by_edit_line",
      this.paste_lines_by_edit_line_end
    );

    instance!.proxy!.$NativeEventBus.on(
      "change_type_by_edit_line",
      this.change_type_by_edit_line_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "delete_line_by_edit_line",
      this.delete_line_by_edit_line_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "space_change_line_by_edit_line",
      this.space_change_line_by_edit_line_end
    );
    instance!.proxy!.$NativeEventBus.on(
      "content_change_line_by_edit_line",
      this.content_change_line_by_edit_line_end
    );

    instance!.proxy!.$NativeEventBus.on(
      "left_index_focus_by_edit_line",
      this.left_index_focus_by_edit_line_end
    );
  },
  beforeUnmount(): void {
    window.removeEventListener("resize", this.sizeControl, false);
    instance!.proxy!.$NativeEventBus.off(
      "change_lines_by_edit_line",
      this.change_lines_by_edit_line_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "tool_change_by_edit_root_tool",
      this.tool_change_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "clean_space_line_all_by_edit_root_tool",
      this.clean_space_line_all_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "id_true_format_by_edit_root_tool",
      this.id_true_format_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "post_server_data_by_edit_root_tool",
      this.post_server_data_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "give_up_page_by_edit_root_tool",
      this.give_up_page_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "view_content_by_edit_root_tool",
      this.view_content_by_edit_root_tool_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "post_server_data_then_view_by_edit_root_tool",
      this.post_server_data_then_view_by_edit_root_tool_end
    );

    instance!.proxy!.$NativeEventBus.off(
      "enter_load_line_by_edit_line",
      this.enter_load_line_by_edit_line_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "merge_two_lines_by_edit_line",
      this.merge_two_lines_by_edit_line_end
    );

    instance!.proxy!.$NativeEventBus.off(
      "paste_lines_by_edit_line",
      this.paste_lines_by_edit_line_end
    );

    instance!.proxy!.$NativeEventBus.off(
      "change_type_by_edit_line",
      this.change_type_by_edit_line_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "delete_line_by_edit_line",
      this.delete_line_by_edit_line_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "space_change_line_by_edit_line",
      this.space_change_line_by_edit_line_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "content_change_line_by_edit_line",
      this.content_change_line_by_edit_line_end
    );

    instance!.proxy!.$NativeEventBus.off(
      "left_index_focus_by_edit_line",
      this.left_index_focus_by_edit_line_end
    );
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
