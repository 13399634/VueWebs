<template>
  <div id="work" v-if="page !== 0">
    <chapter-work-info
      key="chapter-work-info-cache"
      v-bind:title="title"
      v-bind:page="page"
    ></chapter-work-info>
    <chapter-work-item
      v-for="index in page"
      v-bind:key="`${localId}-${index}`"
      v-bind:index="index"
      v-bind:page="page"
      v-bind:url="urls[index - 1]"
    ></chapter-work-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import superagent from "superagent";
import { ReLocal899PixivImageAjax } from "@/../Js/PixivImageLocal/urlRe";
import { getIdAll } from "@/../Js/PixivImageLocal/getAll";
import { chapterWorkUrl } from "@/../Js/PixivImageLocal/routerPath";
// 作品信息
import ChapterWorkInfo from "@/PixivImageLocal/components/chapterWorkInfo.vue";
// 作品
import ChapterWorkItem from "@/PixivImageLocal/components/chapterWorkItem.vue";

export default defineComponent({
  name: "chapterWorkApp",
  components: { ChapterWorkInfo, ChapterWorkItem },
  props: {
    // 作品 id
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data: function (): {
    // 作品所有id
    ids: Array<string>;
    // 作品 页数
    page: number;
    // 作品名
    title: string;
    // 扩展名
    ex: string;
    // 本地 作品 id
    localId: number;
  } {
    return {
      ids: [],
      page: 0,
      ex: "",
      title: "",
      localId: typeof this.id === "number" ? this.id : Number(this.id),
    };
  },
  computed: {
    // 本地 作品 id toString
    localIdX: function (): string {
      return this.localId.toString();
    },
    // localIdX
    urls: function (): Array<string> {
      const urls: Array<string> = [];
      for (let page = 0; page < this.page; page++) {
        urls.push(
          `http://localhost:899/data/pic/pixivImage/${this.title.replace(
            /["*:?|<>\b\n\\/]/g,
            "_"
          )}_${this.localId}_p${page}.${this.ex}`
        );
      }
      return urls;
    },
    // 可跳转
    ableJump: function (): boolean {
      return this.page != 0;
    },
    // 可跳转到上一页
    previewAble: function (): boolean {
      return this.ableJump && this.localIdX !== this.ids![0];
    },
    // 可跳转到下一页
    nextAble: function (): boolean {
      return this.ableJump && this.localIdX !== this.ids![this.ids!.length - 1];
    },
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取作品信息
     */
    getWork: async function (): Promise<void> {
      interface resType {
        // 作品 id
        id: [string];
        // 作品url解析
        url: Array<string>;
        // 作品名
        title: [string];
        // 作品 页数
        page: [string];
        // 作者 id
        uid: [string];
      }

      let res: resType;
      try {
        let response: superagent.Response = await superagent
          .get(`${ReLocal899PixivImageAjax}Pics.json`)
          .query({ id: this.localId })
          .set("accept", "text/json");
        res = response.body as resType;
      } catch (e) {
        // 页面数据不存在
        // 创建默认值
        this.page = 0;
        return undefined;
      }
      this.page = Number(res.page[0]);
      this.title = res.title[0];
      // 作品url解析
      const url = res.url[0];
      this.ex = url.substring(url.lastIndexOf(".") + 1);
      document.title = `${this.title} - pixiv image work`;
    },
    /**
     * @function
     * @async
     * @param process {number} 页面跳转数量
     * @description 页面跳转
     */
    jumpCore: async function (process: number): Promise<void> {
      if (
        // 页面可跳转
        (process === 1 && this.nextAble) ||
        (process === -1 && this.previewAble)
      ) {
        this.localId = Number(
          this.ids![this.ids!.indexOf(this.localIdX) + process]
        );
        // 更新地址栏
        history.replaceState(null, "", chapterWorkUrl(this.localId));
        // 重置页数
        this.page = 0;
        // 获取作品信息
        await this.getWork();
      } else {
        return undefined;
      }
    },
    remove: async function (process: number): Promise<void> {
      superagent
        .post(`${ReLocal899PixivImageAjax}WorkIdRemove.json`)
        .set("Content-Type", "application/json;charset=utf-8")
        .type("form")
        .send({
          id: this.localId,
          pages: JSON.stringify(this.urls),
        })
        .end();
      const idx: number = this.ids!.indexOf(this.localIdX);
      const id = Number(this.ids![idx + process]);
      this.ids!.splice(idx, 1);
      this.localId = id;
      // 更新地址栏
      history.replaceState(null, "", chapterWorkUrl(this.localId));
      // 重置页数
      this.page = 0;
      // 获取作品信息
      await this.getWork();
    },
    keyupControl: function (ev: KeyboardEvent) {
      const ctrl: boolean = ev.ctrlKey;
      const alt: boolean = ev.altKey;
      const shift: boolean = ev.shiftKey;
      const key: string = ev.key;
      if (!ctrl && !alt && !shift) {
        if (key === "a") {
          if (this.previewAble) {
            ev.preventDefault();
            ev.stopPropagation();
            this.jumpCore(-1);
          }
        } else if (key === "d") {
          if (this.nextAble) {
            ev.preventDefault();
            ev.stopPropagation();
            this.jumpCore(1);
          }
        }
      } else if (ctrl && !alt && !shift) {
        if (key === "d") {
          ev.preventDefault();
          ev.stopPropagation();
          if (this.nextAble) {
            this.remove(1);
          } else if (this.previewAble) {
            this.remove(-1);
          } else {
            this.remove(0);
          }
        }
      }
    },
    keydownControl: function (ev: KeyboardEvent) {
      const ctrl: boolean = ev.ctrlKey;
      const alt: boolean = ev.altKey;
      const shift: boolean = ev.shiftKey;
      const key: string = ev.key;
      if (ctrl && !alt && !shift) {
        if (key === "d") {
          ev.preventDefault();
          ev.stopPropagation();
        }
      }
    },
  },
  mounted: async function (): Promise<void> {
    // 获取所有作品id
    this.ids = await getIdAll();
    // 获取作品信息
    await this.getWork();
    window.addEventListener("keydown", this.keydownControl);
    window.addEventListener("keyup", this.keyupControl);
  },
});
</script>

<style lang="scss">
body {
  margin: 0;

  &.full {
    padding: 0 0.5em;

    #work {
      img {
        width: 100%;
      }
    }
  }

  &.limit-width {
    padding: 0 0 0 0.5em;

    #work {
      img {
      }
    }
  }
}
</style>
