import router from "@/PixivEbook/router";

export const allName = "index";
export const bookName = "book";
export const chapterName = "chapter";

/**
 * @description 获取所有书本页链接
 */
export function allUrl(): string {
  return router.resolve({
    path: allName,
  }).href;
}

/**
 * @param bid {number} 书本 id
 * @description 获取书本目录页链接
 */
export function bookUrl(bid: number | string): string {
  return router.resolve({
    path: bookName,
    query: {
      // 书本 id
      bid: bid,
    },
  }).href;
}

/**
 * @param cid {number} 章节 id
 * @description 获取书本章节页链接
 */
export function chapterUrl(cid: number | string): string {
  return router.resolve({
    path: chapterName,
    query: {
      // 章节 id
      cid: cid,
    },
  }).href;
}
