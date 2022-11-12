import { ComponentInternalInstance } from "vue";
import { MsgLineColor, MsgLineTransmitInfo } from "./msg-line-type";

export function msgPush(
  instance: ComponentInternalInstance | null,
  msgLineColor: MsgLineColor,
  info: string
): void {
  //
  const transmit: MsgLineTransmitInfo = {
    color: msgLineColor,
    info: info,
  };
  /**
   * @see from_edit_msg_info_listen_add_msg
   */
  // msg 推送
  instance!.proxy!.$NativeEventBus.emit(
    "from_edit_msg_info_listen_add_msg",
    transmit
  );
}
