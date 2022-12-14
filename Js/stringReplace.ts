declare interface String {
  stringReplaceC1(c1: string, d: string): string;

  stringReplaceC2(c2: string, d: string): string;
}

/**
 * @function
 * @param c1 匹配字符串
 * @param d 替换字符串
 * @description 替换字符串
 */
String.prototype.stringReplaceC1 = function (
  this: string,
  c1: string,
  d: string
) {
  // 当前字符串长度
  const tl: number = this.length;
  // 缓存替换后的字符串的数组
  const tmp: Array<string> = new Array(tl);

  // 遍历当前字符串
  for (let i = 0; i < tl; i++) {
    // 字符
    const char: string = this[i];
    // 匹配到字符串
    if (char === c1) {
      // 新增匹配字符串
      tmp[i] = d;
    } else {
      // 新增旧有字符串
      tmp[i] = char;
    }
  }
  // 连接字符串
  return tmp.join("");
};

/**
 * @function
 * @param c2 匹配字符串
 * @param d 替换字符串
 * @description 替换字符串
 */
String.prototype.stringReplaceC2 = function (c2: string, d: string) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const text = this;
  // 当前字符串长度
  const tl: number = text.length;
  // 缓存替换后的字符串的数组
  const tmp: Array<string> = [];

  // 匹配字符串 查询index
  let ci = 0;
  // 匹配字符串长度
  const cl: number = c2.length;
  // 匹配字符串查询结束
  const ce: number = cl - 1;
  // 二级缓存
  let ctp: Array<string> = new Array(ce);

  for (let i = 0; i < tl; i++) {
    // 字符
    const char: string = this[i];
    // 匹配到字符串
    if (char === c2[ci]) {
      if (ci === ce) {
        // 新增匹配字符串
        tmp.push(d);
        // 二级缓存归零
        ctp = new Array(cl);
        // 查询index归零
        ci = 0;
      } else {
        // 新增二级缓存
        ctp[ci] = char;
        ci++;
      }
    } else {
      if (ci === 0) {
        // 新增旧有字符串
        tmp.push(char);
      } else {
        // 新增旧有字符串
        tmp.push(...ctp, char);
        // 二级缓存归零
        ctp = new Array(cl);
        // 查询index归零
        ci = 0;
      }
    }
  }
  // 连接字符串
  return tmp.concat(ctp).join("");
};
