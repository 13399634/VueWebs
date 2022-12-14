import router from "@/PixivImageLocal/router";

export const chapterAllName = "chapter-all";
export const chapterWorkName = "chapter-work";

/**
 * @description 获取所有作品页链接
 */
export function chapterAllUrl(): string {
  return router.resolve({
    path: chapterAllName,
  }).href;
}

/**
 * @param id {number | string} 书本 id
 * @description 获取作品页链接
 */
export function chapterWorkUrl(id: number | string): string {
  return router.resolve({
    path: chapterWorkName,
    query: {
      // 作品 id
      id: id,
    },
  }).href;
}
