/**
 * @function
 * @param str {string} 字符串数字
 * @return {number} number数字
 */
function eval2(str: string): number {
  // 构造函数 获取返回值 string=>number
  return new Function(`return ${str}`)();
}

export { eval2 };
