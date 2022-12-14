<template>
  <div id="msg-print">
    <edit-msg-line
      v-for="msg in msg_info"
      v-bind:key="msg.id"
      v-bind:color="msg.color"
      v-bind:info="msg.info"
    ></edit-msg-line>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "vue";
import {
  MsgLineColor,
  MsgLineTransmitInfo,
  MsgLineType,
} from "@/../Js/superLxLines2/msg-line-type";
import { DateTime } from "@/../Js/tools-getDate";
// 输出行
import EditMsgLine from "@/superLxLines2/components/editMsgLine.vue";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "editMsgInfo",
  components: { EditMsgLine },
  data: function (): {
    // msg展示行数据序列
    msg_info: Array<MsgLineType>;
    // msg展示行数据可被使用的id
    msg_id: number;
  } {
    return {
      msg_info: [],
      msg_id: 0,
    };
  },
  methods: {
    /**
     * @function
     * @description 接受信息 初始化msg输出窗口
     */
    from_edit_msg_info_listen_clean_cmd: function (): void {
      // id归零
      this.msg_id = 0;
      // 旧有信息清空
      this.msg_info = [];
    },
    /**
     * @function
     * @description 接受信息 添加新的输出行
     */
    from_edit_msg_info_listen_add_msg: function (param: unknown): void {
      // 数据转换
      const msgLineTransmitInfo: MsgLineTransmitInfo =
        param as MsgLineTransmitInfo;
      // 颜色
      const color: MsgLineColor = msgLineTransmitInfo.color;
      // 输出信息
      const info: string = msgLineTransmitInfo.info;
      // 最大展示10行
      if (this.msg_id >= 10) {
        this.msg_info.shift();
      }
      // 推送信息
      this.msg_info.push({
        color: color,
        info: `${DateTime.getTime("<Q2/h>:<Q2/m>:<Q2/s>")} ${info}`,
        id: this.msg_id++,
      });
    },
  },
  mounted: function (): void {
    instance = getCurrentInstance();
    instance!.proxy!.$NativeEventBus.on(
      "from_edit_msg_info_listen_clean_cmd",
      this.from_edit_msg_info_listen_clean_cmd
    );
    instance!.proxy!.$NativeEventBus.on(
      "from_edit_msg_info_listen_add_msg",
      this.from_edit_msg_info_listen_add_msg
    );
  },
  beforeUnmount(): void {
    instance!.proxy!.$NativeEventBus.off(
      "from_edit_msg_info_listen_clean_cmd",
      this.from_edit_msg_info_listen_clean_cmd
    );
    instance!.proxy!.$NativeEventBus.off(
      "from_edit_msg_info_listen_add_msg",
      this.from_edit_msg_info_listen_add_msg
    );
  },
});
</script>

<style scoped>
#msg-print {
  position: relative;
  height: 0;
  width: 0;
  float: left;
  left: -16em;
}
</style>
