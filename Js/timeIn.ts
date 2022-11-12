import { DateTime } from "./tools-getDate";

/**
 * @function
 * @export
 * @param thisObject {()=>never} 函数本体
 * @param min_ms {number} 间歇毫秒数
 * @param name {string} 函数储存名字
 * @return {boolean} true 函数执行后的一段时间内函数将无法运作<br/>
 * @return {boolean} false 允许函数执行
 * @description 函数执行后的一段时间内函数将无法运作
 */
export function throttle_ms(
  // eslint-disable-next-line @typescript-eslint/ban-types
  thisObject: Function,
  min_ms = 100,
  name = "ms"
): boolean {
  // 获取当前时间戳
  const timeStamp: number = DateTime.getTimeMs();
  // 获取函数的构造函数
  const c = thisObject.constructor;
  // 函数的构造函数中存储的对象不存在
  if (c[name] === undefined) {
    // 设置时间戳
    c[name] = timeStamp;
    // 允许函数执行
  } else {
    // 时间戳差是否达到间歇毫秒数
    if (timeStamp - c[name] < min_ms) {
      // 未达到
      // 不允许函数执行
      return true;
    } else {
      // 达到
      // 设置时间戳
      c[name] = timeStamp;
      // 允许函数执行
    }
  }
  return false;
}
