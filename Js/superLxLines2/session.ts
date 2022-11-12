// 所有页面数据
const pagesKey = "pages";
// 正在编辑页面的数据
const pageKey = "page";

/**
 * @function
 * @description 初始化view 消除sessionStorage中的数据
 */
export function initViewSession(): void {
  sessionStorage[pagesKey] = "";
  sessionStorage[pageKey] = "";
}

/**
 * @function
 * @description 获取所有页面数据
 */
export function getPagesSession(): string {
  return sessionStorage[pagesKey];
}

/**
 * @function
 * @description 编辑页面的数据
 */
export function getPageSession(): string {
  return sessionStorage[pageKey];
}

/**
 * @function
 * @param pages {string} 所有页面数据
 * @description 初始化view 加载数据到sessionStorage
 */
export function pushViewSession(pages: string): void {
  sessionStorage[pagesKey] = pages;
}

/**
 * @function
 * @param page {string} 正在编辑页面的数据
 * @description 初始化edit 加载数据到sessionStorage
 */
export function pushEditSession(page: string): void {
  sessionStorage[pageKey] = page;
}

/**
 * @function
 * @description 初始化edit 消除sessionStorage中的正在编辑的数据数据
 */
export function delEditSession(): void {
  sessionStorage[pageKey] = "";
}
