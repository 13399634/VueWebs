export interface enter_load_line_by_edit_line_type {
  // input内容选取首位坐标
  selectionStartEndOrder: [number, number];
  // index
  index: number;
  // 当前行根节点
  currentLine: HTMLDivElement;
}

export interface change_lines_by_edit_line_type {
  // input内容选取首位坐标
  selectionStartEndOrder: [number, number];
  // index
  index: number;
  // 粘贴数据
  text: string;
}

export type paste_lines_by_edit_line_type = change_lines_by_edit_line_type;

export interface merge_two_lines_by_edit_line_type {
  // index
  index: number;
  // 当前行根节点
  currentLine: HTMLDivElement;
}

export interface space_change_line_by_edit_line_type {
  // index
  index: number;
  // 空格计数
  space: number;
}

export interface content_change_line_by_edit_line_type {
  // index
  index: number;
  // coreInput内容
  content: string;
}
