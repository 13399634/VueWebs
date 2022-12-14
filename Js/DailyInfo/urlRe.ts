/**
 * @const
 * @type boolean
 * @description 是否是生产环境
 */
const dev: boolean = process.env.NODE_ENV === "development";
/**
 * @const
 * @type string
 * @description 在生产环境下对localhost:899站点的json地址代理转发避免浏览器同源问题
 * @description 在生产环境下对localhost:899站点的静态资源代理转发
 */
const ReLocal899Origin: string = dev
  ? "./ReLocal899Origin"
  : "http://localhost:899/";

const ReLocal899DailyAjax = `${ReLocal899Origin}daily-info/ebook/`;

export { ReLocal899Origin, ReLocal899DailyAjax, dev };
