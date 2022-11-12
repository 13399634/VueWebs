interface dateMapType {
  Y: number;
  M: number;
  D: number;
  h: number;
  m: number;
  s: number;
}
type dateMapKey = keyof dateMapType;

/**
 * @class DateTime
 * @static
 * @classdesc 日期操作
 */
export class DateTime {
  /**
   * @method getTimeMs
   * @for DateTime
   * @public
   * @static
   * @return {number} 毫秒时间戳
   * @description 获取当前毫秒时间戳
   */
  public static getTimeMs(): number {
    return new Date().getTime();
  }

  /**
   * @method getTime
   * @for DateTime
   * @public
   * @static
   * @param format {string} 格式化参数
   * @return {string} 当前时间格式化字符串
   * @description 获取当前时间的格式化字符串
   * @example
   * 2020年10月24日10时8分12秒
   * > getTime('<q/Y>年<q/M>月<q/D>日<q/h>时<q/m>分<q/s>秒')
   * => 2020年10月24日10时8分12秒
   * > getTime('<Q4/Y>年<Q2/M>月<Q2/D>日<Q2/h>时<Q2/m>分<Q2/s>秒')
   * => 2020年10月24日10时08分12秒
   * > getTime('<Q4/Y>:<Q2/M>:<Q2/D>-<Q2/h>.<Q2/m>.<Q2/s>')
   * => 2020:10:24-10.08.12
   */
  public static getTime(format: string): string {
    // 获取当前时间戳
    const date: Date = new Date();
    // 格式化块
    const keys: string[] = [];
    // 格式化块替换参数
    const values: string[] = [];
    // 获取格式化分块
    const fm: RegExpMatchArray | null = format.match(this.eq);
    // 为获取到格式化块 格式错误
    if (fm === null) {
      return format;
    }
    // 格式化块中YMDhms时间对应关系
    const dateMap: dateMapType = {
      Y: date.getFullYear(),
      M: date.getMonth() + 1,
      D: date.getDate(),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
    };
    // 格式化分块 对应 替换参数
    for (let i = 0; i < fm.length; i++) {
      // 格式化分块
      const value: string = fm[i];
      // 获取格式化块替换参数
      const fms: RegExpMatchArray = value.match(value) as RegExpMatchArray;
      // 格式化块已存在对应替换参数
      if (values.indexOf(value) === -1) {
        // 未存在
        // YMDhms获取 年月日时分秒数值的键
        const value3: dateMapKey = <dateMapKey>(<unknown>fms[3]);
        // 年月日时分秒的具体数值
        let vb: string = dateMap[value3].toString();
        // Q|q Q设定长度 q最小长度
        if (fms[1] === "Q") {
          // Q设定长度的数值
          const value2: number = parseInt(fms[2]);
          // 年月日时分秒的具体数值的长度
          const vbLength: number = vb.length;
          // Q设定长度的数值 大于 年月日时分秒的具体数值的长度
          if (value2 > vbLength) {
            // 前缀补0
            // 令年月日时分秒的具体数值的长度等于Q设定长度的数值
            vb = `${"0".repeat(value2 - vbLength)}${vb}`;
          }
        }
        // 格式化块添加对应替换参数
        keys.push(value);
        values.push(vb);
      }
    }
    // 格式化分块替换参数 构建 格式化字符串
    for (let i = 0; i < keys.length; i++) {
      // 格式化分块替换参数 替换 格式化参数format 中对应的格式化分块
      format = format.replace(keys[i], values[i]);
      while (format.indexOf(keys[i]) !== -1) {
        format = format.replace(keys[i], values[i]);
      }
    }
    // 返回 时间格式化字符串
    return format;
  }

  /**
   * @method next
   * @for DateTime
   * @public
   * @static
   * @param year {number | string} 年
   * @param month {number | string} 月
   * @param day {number | string} 日
   * @param n {number | string} 日期变化
   * @return {string} 推断后的日期
   * @description 获取变化后的日期
   * @example
   * 20201024
   * > next(2020, 10, 24, +4) // 4天后
   * => 20201028
   * > next(2020, 10, 24, -4) // 4天前
   * => 20201020
   * > next(2020, 10, 24, 0) // 今天
   * => 20201024
   */
  public static next(
    year: number | string,
    month: number | string,
    day: number | string,
    n: number
  ): string {
    // 今天
    if (n === 0) {
      // 格式化返回日期
      return this.fm_YYYYMMDD(year, month, day);
    }
    // 格式化日期
    const dd: Date = new Date(`${year}-${month}-${day}`);
    // 更改日期
    dd.setDate(dd.getDate() + n);
    // 获取更改后的年
    const y: number = dd.getFullYear();
    // 获取更改后的月
    const m: number = dd.getMonth() + 1;
    // 获取更改后的日
    const d: number = dd.getDate();
    // 格式化返回日期
    return this.fm_YYYYMMDD(y, m, d);
  }

  /**
   * @member {RegExp}
   * @for DateTime
   * @private
   * @static
   * @description 获取格式化块
   */
  private static eq = RegExp("<Q\\d+|q|/[YMDhms]>", "g");
  /**
   * @member {RegExp}
   * @for DateTime
   * @private
   * @static
   * @description 获取格式化块替换参数
   */
  private static eqs = RegExp("<([Qq]|)(\\d+|)/([YMDhms])>");

  /**
   * @method next
   * @for DateTime
   * @public
   * @static
   * @param year {number | string} 年
   * @param month {number | string} 月
   * @param day {number | string} 日
   * @return {string} 格式化后的日期
   * @description 获取格式化后(YYYYMMDD)的日期
   */
  private static fm_YYYYMMDD(
    year: number | string,
    month: number | string,
    day: number | string
  ): string {
    // 月份格式化
    let ms: string;
    if (month < 10) {
      ms = `0${month}`;
    } else {
      ms = `${month}`;
    }
    // 日期格式化
    let ds: string;
    if (day < 10) {
      ds = `0${day}`;
    } else {
      ds = `${day}`;
    }
    return `${year}${ms}${ds}`;
  }
}
