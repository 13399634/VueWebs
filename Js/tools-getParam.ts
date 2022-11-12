/**
 * @class UrlParam
 * @static
 * @classdesc 对url search进行查询和更新操作
 */
export class UrlParam {
  /**
   * @method get
   * @for UrlParam
   * @public
   * @static
   * @param key {string} 需要查询的键
   * @returns {string} 键key在url search中对应的value值 <br/>
   * @returns {null} url search为空 <br/>
   * @returns {null} 未在url search中查询到键key对应value值 <br/>
   * @returns {null} url search中查询到键key对应value值为空
   * @desc 获取键key在url search中对应的value值
   */
  public static get(key: string): string | null {
    // 获取url search
    let search: string = window.location.search;
    // 判断search非空
    if (search !== "") {
      // 解码url search
      search = decodeURI(search.slice(1));
      // 分割search参数
      const params: string[] = search.split("&");
      // 预处理 简化拼接
      key = `${key}=`;
      // 预处理 获取键key的长度
      const len: number = key.length;
      // 查询键key在search中对应的value值
      for (let i = 0; i < params.length; i++) {
        // url search中的一个键值对
        const param: string = params[i];
        // slice 简化查询 ‘=’ 防止误判
        // 判断键值对中键与当前key一致
        if (param.slice(0, len) === key) {
          // 获取键值对中的值
          const value: string = param.slice(len);
          // 值非空
          if (value === "") {
            // url search中查询到键key对应value值为空
            return null;
          }
          // 返回值
          return value;
        }
      }
      // 未在url search中查询到键key对应value值
      return null;
    } else {
      // url search为空
      return null;
    }
  }

  /**
   * @method setInfo
   * @for UrlParam
   * @public
   * @static
   * @param key {string} 需要更新的键
   * @param value {string} 需要更新的值
   * @return {string} 更新后的url search
   * @desc 获取将要更新替换的url search
   */
  public static setInfo(key: string, value: string): string {
    // 获取url search
    const s: string = window.location.search;
    // 判断search非空
    if (s === "") {
      // 直接替换键值对
      return `?${key}=${value}`;
    } else {
      // 匹配键key
      const m: RegExpMatchArray | null = s.slice(1).match(`${key}=[^&#]*`);
      if (m === null) {
        // 未匹配到
        // 后缀方式增加
        return `${s}&${key}=${value}`;
      } else {
        // 匹配到
        // 替换value
        return `${s.slice(
          0,
          (m.index as number) + key.length + 2
        )}${value}${s.slice((m.index as number) + m[0].length + 1)}`;
      }
    }
  }

  /**
   * @method set
   * @for UrlParam
   * @public
   * @static
   * @param key {string} 需要更新的键
   * @param value {string} 需要更新的值
   * @desc 更新url search
   */
  public static set(key: string, value: string): void {
    // 更新并自我跳转
    window.location.search = UrlParam.setInfo(key, value);
  }

  /**
   * @method sets
   * @for UrlParam
   * @public
   * @static
   * @param map {{ [key: string] : string }} 需要更新的键值对
   * @desc 更新url search
   */
  public static sets(map: { [key: string]: string }): void {
    // 获取键
    // { unknown, string }
    const keys: string[] = Object.keys(map);
    // 键的数量
    const l: number = keys.length;
    // 键
    let key: string;
    // 处理地址栏
    for (let i = 0; i < l - 1; i++) {
      key = keys[i];
      // 地址栏更新（不刷新）
      UrlParam.setHistory(key, map[key]);
    }
    key = keys[l - 1];
    // 更新并自我跳转
    UrlParam.set(key, map[key]);
  }

  /**
   * @method setHistory
   * @for UrlParam
   * @public
   * @static
   * @param key {string} 需要更新的键
   * @param value {string} 需要更新的值
   * @desc 更新url search(不刷新网页)
   */
  public static setHistory(key: string, value: string): void {
    // 更新
    history.replaceState(
      null,
      "",
      `${window.location.pathname}${UrlParam.setInfo(key, value)}${
        window.location.hash
      }`
    );
  }

  /**
   * @method setHistorys
   * @for UrlParam
   * @public
   * @static
   * @param map {{[key: string]: string}} 需要更新的键值对
   * @desc 更新url search(不刷新网页)
   */
  public static setHistorys(map: { [key: string]: string }): void {
    // 获取键
    const keys: string[] = Object.keys(map);
    // 循环更新
    for (let i = 0, key: string; i < keys.length; i++) {
      // 键
      key = keys[i];
      // 更新
      UrlParam.setHistory(key, map[key]);
    }
  }
}
