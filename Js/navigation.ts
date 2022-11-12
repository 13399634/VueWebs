// 页面导航模型返回类型
enum NavigationType {
  current = 1,
  placeholder = 2,
  page = 3,
}

/**
 * @param page {Number} 当前页面
 * @param total {Number} 页面总数
 * @param base {Number} 默认值 3 最大page数量
 * @return {{ type: NavigationType; page?: Number }[]} 页面导航模型
 * @description 生成页面导航模型
 * @example <1> <(···)> <page max: base> <current> <page max: base> <(···)> <total>
 * @see ./navigation.test
 */
function navigation_model_create(
  page: number,
  total: number,
  base = 3
): { type: NavigationType; page?: number }[] {
  const model: { type: NavigationType; page?: number }[] = [];
  // >· page 向上导航模型
  // page不为1时自动创建 1 page
  // page为1时不创建 1 page
  if (page !== 1) {
    model.push({ type: NavigationType.page, page: 1 });
  }
  if (page <= base + 2) {
    // 1 + 1 => page - 1 len: page - 2
    for (let i = 1; i < page - 1; i++) {
      model.push({ type: NavigationType.page, page: i + 1 });
    }
  } else {
    // 达到省略条件
    // ···
    model.push({ type: NavigationType.placeholder });
    //  page - (base + 1) + 1 => page - 1 len: base
    for (let i = page - (base + 1); i < page - 1; i++) {
      model.push({ type: NavigationType.page, page: i + 1 });
    }
  }
  // >· page 当前导航模型
  // page为1时不创建 1 current
  // page不为1时不创建 page current
  model.push({ type: NavigationType.current, page: page });
  // >· page 向下导航模型
  if (total - page <= base + 1) {
    // page + 1 => total - 1 len: total - 1 - page
    for (let i = page; i < total - 1; i++) {
      model.push({ type: NavigationType.page, page: i + 1 });
    }
  } else {
    // 达到省略条件
    // page + 1 => page + base len: base
    for (let i = page; i < page + base; i++) {
      model.push({ type: NavigationType.page, page: i + 1 });
    }
    // ···
    model.push({ type: NavigationType.placeholder });
  }
  if (total !== page) {
    // total
    model.push({ type: NavigationType.page, page: total });
  }
  return model;
}

export { NavigationType, navigation_model_create };
