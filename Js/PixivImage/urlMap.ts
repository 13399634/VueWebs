/**
 * @const
 * @type {{ '`': string, '^': string, '%': string }}
 * @description url异常字符串替换
 */
const urlMap: { "`": string; "^": string; "%": string } = {
  "`": "null.(-?null_knull?-).null",
  "^": "null.(-?null_null?-).null",
  "%": "null.(-?null_lnull?-).null",
};

/**
 * @const
 * @type { Array<string> }
 * @description url异常字符串
 */
const keys: Array<string> = Object.keys(urlMap);

/**
 * @function
 * @param name {string} url
 * @return {string} 替换后的字符串
 * @description url异常字符串替换
 */
function urlMapReplace(name: string): string {
  // 是否包含异常字符串
  const eb: Array<boolean> = [];
  for (let i = 0; i < keys.length; i++) {
    eb.push(name.indexOf(keys[i]) !== -1);
  }
  // 不包含异常字符串
  if (eb.indexOf(true) === -1) {
    // 直接返回
    return name;
  }
  // url字符串数组
  const ls: Array<string> = [];
  // 遍历url字符串
  for (let i = 0, e: boolean, p: string; i < name.length; i++) {
    // 是否不是一场字符串
    e = true;
    // url字符
    p = name[i];
    // 遍历url异常字符串
    for (let j = 0; j < keys.length; j++) {
      if (eb[j] && p === keys[j]) {
        // 找到异常字符串
        e = false;
        // 替换
        ls.push(urlMap[p]);
        break;
      }
    }
    // 不是一场字符串
    if (e) {
      // 返回原字符串
      ls.push(p);
    }
  }
  // 拼接替换后的url字符串
  return ls.join("");
}

export { urlMapReplace };
