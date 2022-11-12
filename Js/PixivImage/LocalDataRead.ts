/**
 * @const
 * @type {string}
 * @description localStorage uid的key
 */
const uids = "uid_s";
/**
 * @const
 * @type {string}
 * @description localStorage id的key
 */
const ids = "ids";

/**
 * @function
 * @param key {string} localStorage查询键
 * @return {string} localStorage查询结果
 * @description localStorage查询数据
 */
function getLocalData(key: string): string {
  // localStorage查询
  const data: string | null = localStorage.getItem(key);
  if (data === null) {
    // 查询为空
    // 新建数据
    localStorage.setItem(key, "");
    return "";
  } else {
    return data;
  }
}

/**
 * @function
 * @param key {string} localStorage设置键
 * @param value {string} localStorage设置值
 * @description localStorage更新数据
 */
function setLocalData(key: string, value: string): void {
  // localStorage查询
  const data: string | null = localStorage.getItem(key);
  if (data === null) {
    // 查询为空
    // 设置数据
    localStorage.setItem(key, value);
  } else {
    // 查询非空
    // 新增数据
    localStorage.setItem(key, `${data},${value}`);
  }
}

/**
 * @function
 * @return {string} localStorage uid数据
 * @description 获取浏览uid数据
 */
function getLocalUid(): string {
  return getLocalData(uids);
}

/**
 * @function
 * @return {string} localStorage id数据
 * @description 获取浏览id数据
 */
function getLocalId(): string {
  return getLocalData(ids);
}

/**
 * @function
 * @param value {string} uid
 * @description 更新浏览uid数据
 */
function setLocalUid(value: string): void {
  setLocalData(uids, value);
}

/**
 * @function
 * @param value {string} id
 * @description 更新浏览id数据
 */
function setLocalId(value: string): void {
  setLocalData(ids, value);
}

export { getLocalUid, getLocalId, setLocalUid, setLocalId };
