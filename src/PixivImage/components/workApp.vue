<template>
  <div id="nBody" v-if="show">
    <work-pic-side
      v-bind:url="work.url"
      v-bind:page="work.page"
      v-bind:org="work.org"
    ></work-pic-side>
    <work-handle-side
      v-bind:id="work.id"
      v-bind:title="work.title"
      v-bind:org="work.org"
      v-bind:page="work.page"
      v-bind:other="work.other"
      v-bind:user="user"
    ></work-handle-side>
  </div>
</template>

<script lang="ts">
const superagent = require("superagent");
import { defineComponent } from "vue";
import { UrlParam } from "@/../Js/tools-getParam";
import { RePixivOrigin } from "@/../Js/PixivImage/urlRe";
// 图片展示
import WorkPicSide from "@/PixivImage/components/workPicSide.vue";
// 侧边栏
import WorkHandleSide from "@/PixivImage/components/workHandleSide.vue";

// 作品信息数据
interface WorkType {
  // id
  id: null | string;
  // 作品名称
  title: null | string;
  // 作品图片数量
  page: null | number;
  // 作品图片链接 small
  url: null | string;
  // 作品图片链接 origin
  org: null | string;
  // 作品的一些近期相关作品id
  other: null | Array<string>;
}

// 用户信息数据
interface UserType {
  // uid
  uid: null | string;
  // 用户名
  author: null | string;
}

// 匹配 作品的一些近期相关作品id
const getOthers = /"(\d+)":(?:null|\{"id":"\1")/gi;

export default defineComponent({
  name: "workApp",
  components: { WorkHandleSide, WorkPicSide },
  data(): {
    // 加载页面
    show: boolean;
    // 作品信息
    work: WorkType;
    // 用户信息
    user: UserType;
  } {
    return {
      show: false,
      work: {
        id: null,
        title: null,
        page: null,
        url: null,
        org: null,
        other: null,
      },
      user: {
        uid: null,
        author: null,
      },
    };
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取 部分作品信息 和 用户信息
     */
    async getData(): Promise<void> {
      let response;
      try {
        // https://www.pixiv.net/ajax/user/10/illusts?ids[]=[@xxx.number]
        response = await superagent
          .get(`${RePixivOrigin}ajax/user/10/illusts`)
          .query({ "ids[]": this.work.id })
          .set("accept", "text/json");
      } catch (e) {
        // throw new SyntaxError(e);
        return;
      }
      let body: {
        // 作品名称
        title: string;
        // 作品图片数量
        pageCount: number;
        // 作品图片链接 small
        url: string;
        // uid
        userId: string;
        // 用户名
        userName: string;
      } = response.body["body"][this.work.id!];
      this.work.title = body["title"];
      this.work.page = body["pageCount"];
      let viewUrl: string = body["url"];
      // 作品图片链接 small 格式化
      if (viewUrl.indexOf("custom") !== -1) {
        viewUrl = viewUrl
          .replace("c/250x250_80_a2/custom-thumb", "img-master")
          .replace("custom", "master");
      } else {
        viewUrl = viewUrl
          .replace("c/250x250_80_a2/", "")
          .replace("square", "master");
      }
      this.work.url = viewUrl;
      this.user.uid = body["userId"];
      this.user.author = body["userName"];
      // 页面标题加载
      document.title = `${this.work.title} - ${this.user.author} - ${this.work.page}`;
    },
    /**
     * @function
     * @async
     * @description 获取 部分作品信息
     */
    async getArtwork(): Promise<void> {
      let response;
      try {
        // https://www.pixiv.net/artworks/[@xxx.number]
        response = await superagent
          .get(`${RePixivOrigin}artworks/${this.work.id}`)
          .set("accept", "text/plain");
      } catch (e) {
        // throw new SyntaxError(e);
        return;
      }
      let body: string = response.text;
      // 定位 作品图片链接 origin 区块 开始
      let rIndex: number = body.indexOf("img-original");
      // 最大长度(100)获取 作品图片链接 origin 区块
      let org: string = body.substring(rIndex, rIndex + 100);
      // 获取 作品图片链接 origin
      this.work.org = `https://i.pximg.net/${org.substring(
        0,
        org.indexOf('"')
      )}`;
      // 作品的一些近期相关作品id
      let other: Array<string> = [];
      // 获取 作者所有作品id 步骤1 全匹配
      let m: RegExpMatchArray | null = body.match(getOthers);
      // 未获取到作品id
      if (!m) {
        return;
      }
      // 遍历 作者所有作品id 步骤1 全匹配
      for (let i = 0; i < m.length; i++) {
        // 作品id 步骤1 全匹配
        let other_: string = m[i];
        // 获取 作者所有作品id 完结 缩减
        other.push(other_.slice(1, other_.indexOf('"', 1)));
      }
      // 作者所有作品id 作品当前序列
      let index: number = other.indexOf(this.work.id!);
      // 作品的一些近期相关作品id 起始序列
      let start: number = index - 5;
      // 作品的一些近期相关作品id 终止序列
      let end: number;
      if (start < 0) {
        // 起始序列小于0
        // 起始序列设为0
        start = 0;
        // 终止序列最大
        end = 10;
      } else {
        // 起始序列不小于0
        // 终止序列 为当前序列+5
        end = index + 5;
      }
      // 作品的一些近期相关作品id <= 作者所有作品id 起始序列 终止序列 截取
      other = other.slice(start, end);
      // 提交
      this.work.other = other;
    },
  },
  async created(): Promise<void> {
    // 获取作品id
    this.work.id = UrlParam.get("id");
    // 获取 作品信息 和 用户信息
    await Promise.all([this.getData(), this.getArtwork()]).then(async () => {
      // 加载页面
      this.show = true;
    });
  },
});
</script>

<style lang="scss" scoped>
#nBody {
  min-width: 60em;
}
</style>
