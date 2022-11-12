// msg展示行颜色
export enum MsgLineColor {
  green = "green",
  red = "red",
}

// msg传递行数据
export interface MsgLineTransmitInfo {
  // 颜色
  color: MsgLineColor;
  // 输出信息
  info: string;
}

// msg展示行数据
export interface MsgLineType extends MsgLineTransmitInfo {
  // 序列id
  id: number;
}
