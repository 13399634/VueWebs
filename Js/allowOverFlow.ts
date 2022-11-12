/**
 * @function
 * @export
 * @param barObject {HTMLElement} 工具栏
 * @param finalObject {HTMLElement} 展示窗口 最终作用体
 * @param body {HTMLElement} 总框架
 * @description 一种页面布局
 * @description 总框架支撑页面当前高度
 * @description 工具栏和展示窗口支撑总框架
 * @description 工具栏无滚动条
 * @description 展示窗口允许生成滚动条
 */
export function allowOverFlow(
  barObject: HTMLElement,
  finalObject: HTMLElement,
  body: HTMLElement = document.body
): void {
  // 页面当前高度
  const cH: number = document.documentElement.clientHeight;
  // 总框架支撑页面当前高度
  body.style.height = `${cH}px`;
  // 展示窗口内嵌
  finalObject.style.height = `${cH - barObject.clientHeight}px`;
}
