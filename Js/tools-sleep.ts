/**
 * @function
 * @param time {number} 时间
 * @returns {Promise<unknown>}
 * @description 等待
 */
export function sleep(time: number): Promise<null> {
  return new Promise((resolve) => setTimeout(resolve, time));
}
