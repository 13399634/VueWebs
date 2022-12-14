import router from "@/DailyInfo/router";

export const indexName = "index";
export const infoName = "info";

/**
 * @description 获取所有存在日期页链接
 */
export function indexUrl(): string {
  return router.resolve({
    path: indexName,
  }).href;
}

/**
 * @param date {string} 书本 id
 * @description 获取日期信息页链接
 */
export function infoUrl(date: string): string {
  return router.resolve({
    path: infoName,
    query: {
      // 日期
      date: date,
    },
  }).href;
}
