// 段落数据
export interface ContentType {
  // 内容
  content: string;
  // 序列
  id: number;
  // 前置空格
  space: number;
  // 类型
  type: number;
}

export class IContentType implements ContentType {
  content = "";
  id = 0;
  space = 0;
  type = 0;
}

// 页面数据
export interface PageType {
  // 序列
  id: number;
  // 页数
  page: number;
  // 段落数据
  content: Array<ContentType>;
}

export class IPageType implements PageType {
  id = 0;
  page = 1;
  content = [new IContentType()];
}
