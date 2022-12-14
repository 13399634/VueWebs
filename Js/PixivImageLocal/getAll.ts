import superagent from "superagent";
import { ReLocal899PixivImageAjax } from "./urlRe";

/**
 * @function
 * @async
 * @description 获取所有作品id
 */
export async function getIdAll(): Promise<Array<string>> {
  interface resType {
    // 所有作品id
    id: Array<string>;
  }

  let res: resType;
  try {
    const response: superagent.Response = await superagent
      .get(`${ReLocal899PixivImageAjax}IdAll.json`)
      .set("accept", "text/json");
    res = response.body as resType;
  } catch (e) {
    // 页面数据不存在
    // 创建默认值
    return [];
  }
  // 排序
  return res.id.sort();
}
