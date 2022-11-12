/**
 * @function
 * @export
 * @param o1 {number} 排序数字1
 * @param o2 {number} 排序数字2
 * @param asc {boolean} true顺序 false倒序
 * @return {[number, number]} 顺序数字数组
 * @description 数字排序
 */
export function getStartEndOrder(
  o1: number,
  o2: number,
  asc = true
): [number, number] {
  const desc: boolean = o1 > o2;
  if ((desc && asc) || (!desc && !asc)) {
    return [o2, o1];
  } else {
    return [o1, o2];
  }
}
