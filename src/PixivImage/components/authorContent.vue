<template>
  <div id="nBody">
    <author-content-item
      v-for="work in data"
      v-bind:key="work.id"
      v-bind:work="work"
    ></author-content-item>
    <author-page-navigation
      v-if="show"
      v-bind:page="page"
      v-bind:total="pageTotal"
    ></author-page-navigation>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "vue";
import superagent from "superagent";
import { eval2 } from "@/../Js/eval";
import { dev, RePixivOrigin } from "@/../Js/PixivImage/urlRe";
import { getLocalId } from "@/../Js/PixivImage/LocalDataRead";
import { UrlParam } from "@/../Js/tools-getParam";
// 单个作品展示
import AuthorContentItem from "@/PixivImage/components/authorContentItem.vue";
// 页面跳转 作品展示数量限制24*5
import AuthorPageNavigation from "@/PixivImage/components/authorPageNavigation.vue";

// 作品数据
interface WorkType {
  // 作品id
  id: string;
  // 作品图片展示链接 small
  url: string;
  // 作品标题
  title: string;
  // 作品图片总数
  page: number;
  // 作品是否浏览过
  ex: boolean;
}

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "authorContent",
  components: {
    AuthorPageNavigation,
    AuthorContentItem,
  },
  props: {
    // uid
    uid: {
      type: String,
      required: true,
    },
  },
  data(): {
    // 查询页面最大id数量
    maxNum: number;
    // 一个页面放置查询数据页面的总数
    pageNum: number;
    // 导航页面允许加载
    show: boolean;
    // ids序列
    ids: string[] | null;
    // 数据查询所需ids的切片序号
    idsPage: [number, number][][] | null;
    // 页面总数
    pageTotal: number | null;
    // 当前页数
    page: number;
    // 作品数据
    data: WorkType[] | null;
  } {
    let page: number | string | null = UrlParam.get("page");
    if (page === null) {
      UrlParam.setHistory("page", "1");
      page = 1;
    } else {
      page = eval2(page);
    }
    return {
      maxNum: 24,
      // 生产环境
      pageNum: dev ? 1 : 5,
      show: false,
      ids: null,
      idsPage: null,
      pageTotal: null,
      page: page,
      data: null,
    };
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取ids序列
     */
    async getIds(): Promise<void> {
      let response;
      try {
        // https://www.pixiv.net/ajax/user/[xxx.number]/profile/all
        response = await superagent
          .get(`${RePixivOrigin}ajax/user/${this.uid}/profile/all`)
          .query({
            p: 10086,
          })
          .set("accept", "text/plain");
      } catch (e) {
        throw new SyntaxError();
      }
      // ids序列
      let ids: string[] = Object.keys(response.body["body"]["illusts"]);
      // ids序列非空
      if (ids.length === 0) {
        return;
      }
      // ids序列 逆转顺序
      ids.reverse();
      // 提交
      this.ids = ids;
      // 数据查询所需ids的切片序号
      let idsPage: [number, number][][] = [];
      // ids序列 长度
      let idsLen: number = ids.length;
      for (let i = 0; i < idsLen;) {
        // 一轮查询 需求一系列的ids首尾序列
        let _ids: [number, number][] = [];
        for (
          let j = 0;
          j < this.pageNum && i < idsLen;
          j++, i = i + this.maxNum
        ) {
          // 一轮查询 需求一个的ids首尾序列
          _ids.push([i, i + this.maxNum]);
        }
        idsPage.push(_ids);
      }
      // 提交
      this.idsPage = idsPage;
      // 总页面数
      let pageTotal: number = idsPage.length;
      // 提交
      this.pageTotal = pageTotal;
      // 总页面数非0
      if (pageTotal !== 0) {
        // 当前页数
        let page: number = this.page;
        // 页数 非空 小于等于总页面数 大于0 非浮点
        if (
          page === null ||
          pageTotal < page ||
          page <= 0 ||
          page !== Math.ceil(page)
        ) {
          // 页数重置为1
          this.page = 1;
          UrlParam.setHistory("p", "1");
        }
        let title: string = document.title;
        // if (document.title.indexOf("{page}") === -1) {
        //   document.title = title.replace(
        //     /- \d+ -\d+ - PixivImage author/,
        //     `${page} - ${pageTotal} PixivImage author`
        //   );
        // } else {
        // }
        document.title = title.replace("{page}", `${page} - ${pageTotal}`);
        UrlParam.setHistory("total", pageTotal.toString());
      }
    },
    /**
     * @function
     * @async
     * @description 获取作品数据
     */
    async getIdInfo(): Promise<void> {
      // 一轮查询 需求一系列的ids首尾序列
      let idsPage: [number, number][] = this.idsPage![this.page - 1]!;
      // 本地 作品数据
      let info: WorkType[] = [];
      // 本地浏览id数据
      let ids = `,${getLocalId()},`;
      // 遍历 一轮查询 需求一系列的ids首尾序列
      for (let i = 0; i < idsPage.length; i++) {
        // 一次查询ids首尾序列
        let _idsPage: [number, number] = idsPage[i];
        // 响应
        let response;
        try {
          response = await superagent
            .get(
              `${RePixivOrigin}ajax/user/10/profile/illusts?ids[]=${this.ids!.slice(
                _idsPage[0],
                _idsPage[1]
              ).join("&ids[]=")}`
            )
            .query({
              work_category: "illustManga",
              is_first_page: 1,
              lang: "zh",
            })
            .set("accept", "text/json");
        } catch (e) {
          throw new SyntaxError();
        }
        // 相应数据
        let data: {
          // key 键
          [key: string]: {
            // 作品id
            id: string;
            // 作品图片展示链接 small
            url: string;
            // 作品标题
            title: string;
            // 作品图片总数
            pageCount: number;
          };
        } = response.body["body"]["works"];
        // 相应数据 keys
        let dataKeys: string[] = Object.keys(data);
        // 相应数据 keys 序列反转
        dataKeys.reverse();
        // 遍历 相应数据
        for (let j = 0; j < dataKeys.length; j++) {
          // key 键
          let key: string = dataKeys[j];
          // 作品id
          let id_: string = data[key]["id"];
          info.push({
            id: id_,
            url: data[key]["url"],
            title: data[key]["title"],
            page: data[key]["pageCount"],
            ex: ids.indexOf(`,${id_},`) !== -1,
          });
        }
      }
      this.data = info;
    },
    /**
     * @function
     * @async
     * @param param {unknown} emit 信息
     * @description 跳转页面并发送开始命令给authorPageNavigationItem页面
     * @see authorPageNavigationItem
     * @see page_jump_by_author_page_navigation_item
     * @see page_jump_by_author_page_navigation_item_end_1
     * @see page_jump_by_author_page_navigation_item_end_2
     * <br />
     * @see page_jump_by_author_page_navigation_item_end_1
     * @see page_jump_by_author_content_end
     */
    page_jump_by_author_page_navigation_item_end_1: async function (
      param: unknown
    ): Promise<void> {
      // 接收 page 参数
      this.page = param as number;
      // 设置 page
      UrlParam.setHistory("page", this.page.toString());
      // 发送开始命令给authorPageNavigationItem页面
      instance!.proxy!.$NativeEventBus.emit("page_jump_by_author_content");
      // 重置作品数据
      this.data = [];
      // 重新获取作品数据
      await this.getIdInfo();
    },
  },
  async created() {
    await Promise.all([this.getIds()])
      .then(() => {
        // 加载页面导航页面
        this.show = true;
      })
      .then(this.getIdInfo);
  },
  mounted() {
    instance = getCurrentInstance();
    /**
     * @see page_jump_by_author_page_navigation_item
     * @see page_jump_by_author_page_navigation_item_end_1
     * @see page_jump_by_author_page_navigation_item_end_2
     */
    instance!.proxy!.$NativeEventBus.on(
      "page_jump_by_author_page_navigation_item",
      this.page_jump_by_author_page_navigation_item_end_1
    );
  },
  beforeUnmount() {
    instance!.proxy!.$NativeEventBus.on(
      "page_jump_by_author_page_navigation_item",
      this.page_jump_by_author_page_navigation_item_end_1
    );
  },
});
</script>

<style scoped>
#nBody {
  text-align: center;
}
</style>
