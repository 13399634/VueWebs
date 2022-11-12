const { ReLocal899Origin } = require("./urlRe");
const superagent = require("superagent");

/**
 * @function getDataAll
 * @async
 * @private
 * @param name {string} UidAll | IdAll json名字
 * @return {Promise<{ uid: string[], id: string[] }>} 服务器中的资源
 */
async function getDataAll(
  name: string
): Promise<{ uid: string[]; id: string[] }> {
  try {
    // 资源请求
    const response = await superagent
      .get(`${ReLocal899Origin}pixivImage/ajax/${name}.json`)
      .set("accept", "text/json");
    return response.body;
  } catch (e) {
    // 失败处理
    return { uid: [], id: [] };
  }
}

/**
 * @function getUidAll
 * @async
 * @return {Promise<string[]>} 服务器中所有的UID
 */
async function getUidAll(): Promise<string[]> {
  return (await getDataAll("UidAll")).uid;
}

/**
 * @function getIdAll
 * @async
 * @return {Promise<string[]>} 服务器中所有的ID
 */
async function getIdAll(): Promise<string[]> {
  return (await getDataAll("IdAll")).id;
}

export { getUidAll, getIdAll };
