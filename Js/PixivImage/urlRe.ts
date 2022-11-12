/**
 * @const
 * @type boolean
 * @description 是否是生产环境
 */
const dev: boolean = process.env.NODE_ENV === "development";
/**
 * @const
 * @type string
 * @description 在生产环境下对www.pixiv.net站点的json地址代理转发避免浏览器同源问题
 */
const RePixivOrigin: string = dev
  ? "./RePixivOrigin"
  : "https://www.pixiv.net/";
/**
 * @const
 * @type string
 * @description 在生产环境下对localhost:899站点的json地址代理转发避免浏览器同源问题
 * @description 在生产环境下对localhost:899站点的静态资源代理转发
 */
const ReLocal899Origin: string = dev
  ? "./ReLocal899Origin"
  : "http://localhost:899/";

/**
 * @function
 * @const
 * @param data {string} i.pximg.net站点的url
 * @return {string} 在生产环境下对此站点的图片地址代理伪造referer
 */
const RePximgOriginP: (data: string) => string = dev
  ? (data) => data.replace("s://i.pximg.net", "://localhost:8080/ipximgnet")
  : (data) => data;

export { RePixivOrigin, ReLocal899Origin, RePximgOriginP, dev };
