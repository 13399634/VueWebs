export function sortChinese(item1: string, item2: string): number {
  return item1.localeCompare(item2, "zh-CN");
}

export function sortChineseSNum(
  param1: string | number,
  param2: string | number
): number {
  const param1i: number = typeof param1 === "string" ? Number(param1) : param1;
  const param2i: number = typeof param2 === "string" ? Number(param2) : param2;
  if (!isNaN(param1i)) {
    if (!isNaN(param2i)) {
      if (param1i > param2i) {
        return 1;
      } else if (param1i > param2i) {
        return -1;
      } else {
        return 0;
      }
    } else {
      // 数字 > 非数字
      return 1;
    }
  } else {
    if (!isNaN(param2i)) {
      // 非数字 < 数字
      return -1;
    }
  }

  const param1Len: number = (param1 as string).length;
  const param2Len: number = (param2 as string).length;
  let arrLen: number;

  if (param1Len > param2Len) {
    arrLen = param2Len;
  } else if (param1Len < param2Len) {
    arrLen = param1Len;
  } else {
    if (param1 === param2) {
      return 0;
    } else {
      arrLen = param1Len;
    }
  }

  for (let index = 0; index < arrLen; index++) {
    const c1: string = param1[index];
    const c2: string = param2[index];
    if (c1 === c2) {
      continue;
    }
    const i1: number = c1.charCodeAt(0);
    const i2: number = c2.charCodeAt(0);
    if (i1 <= 122) {
      if (i2 <= 122) {
        if (i1 > i2) {
          return -1;
        } else if (i1 < i2) {
          return 1;
        } else {
          throw new SyntaxError("");
        }
      } else {
        // 数字、字母 > 非数字、字母
        return 1;
      }
    } else {
      if (i2 <= 122) {
        // 非数字、字母 < 数字、字母
        return -1;
      } else {
        const i_: number = c1.localeCompare(c2, "zh");
        if (i_ > 0) {
          return 1;
        } else if (i_ < 0) {
          return -1;
        } else {
          throw new SyntaxError("");
        }
      }
    }
  }

  if (param1Len > param2Len) {
    return -1;
  } else if (param1Len < param2Len) {
    return 1;
  } else {
    throw new SyntaxError("");
  }
}
