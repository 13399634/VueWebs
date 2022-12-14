<template>
  <div id="chapter" v-if="chapter !== null">
    <h3-p>{{ chapter.chapterName }}</h3-p>
    <chapter-jump
      v-bind:key="bid"
      v-bind:bid="typeof bid === 'number' ? bid : Number(bid)"
      v-bind:jumpAble="[previewAble, nextAble]"
      v-if="ableJump"
    ></chapter-jump>
    <chapter-item
      v-for="(line, index) in chapter.lines"
      v-bind:key="`${bid}-${index}`"
      v-bind:line="line"
    >
    </chapter-item>
    <chapter-jump
      v-bind:key="bid"
      v-bind:bid="typeof bid === 'number' ? bid : Number(bid)"
      v-bind:jumpAble="[previewAble, nextAble]"
      v-if="ableJump"
    ></chapter-jump>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "vue";
import H3P from "@/../pasteButton v1.2/h3P.vue";
import { chapterUrl } from "@/../Js/WebEbook/routerPath";
import superagent from "superagent";
import { ReLocal899EbookAjax } from "@/../Js/WebEbook/urlRe";
// 章节跳转
import ChapterJump from "@/WebEbook/components/chapterJump.vue";
// 章节段落
import ChapterItem from "@/WebEbook/components/chapterItem.vue";

// 书本章节信息
interface ChapterDataType {
  // 章节名
  chapterName: string;
  // 所有段落
  lines: Array<string>;
}

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "chapterApp",
  components: { ChapterItem, H3P, ChapterJump },
  props: {
    bid: {
      type: [String, Number],
      required: true,
    },
    cid: {
      type: [String, Number],
      required: true,
    },
  },
  data: function (): {
    // 书本章节信息
    chapter: ChapterDataType | null;
    // 书本章节总数
    pageNum: number | null;
    localCid: number;
  } {
    return {
      chapter: null,
      pageNum: null,
      localCid: typeof this.cid === "number" ? this.cid : Number(this.cid),
    };
  },
  computed: {
    // 可跳转
    ableJump: function (): boolean {
      return this.pageNum != null;
    },
    // 可跳转到上一页
    previewAble: function (): boolean {
      return this.ableJump && this.localCid > 1;
    },
    // 可跳转到下一页
    nextAble: function (): boolean {
      return this.ableJump && this.localCid < this.pageNum!;
    },
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取书本章节信息
     */
    getChapter: async function (): Promise<ChapterDataType> {
      interface resType {
        // 所有段落
        chapter: [string];
        // 章节名
        title: [string];
      }

      let res: resType;
      try {
        let response = await superagent
          .get(`${ReLocal899EbookAjax}chapter.json`)
          .query({
            bid: this.bid,
            cid: this.localCid,
          })
          .set("accept", "text/json");
        res = response.body as resType;
      } catch (e) {
        // 页面数据不存在
        // 创建默认值
        return {
          chapterName: "未获取到图书章节数据",
          lines: [
            "1. 请检查服务器是否运行",
            "2. 请检查服务器中书本数据是否存在",
            "3. 重新刷新页面",
          ],
        };
      }
      const chapterName: string = res.title[0];
      document.title = `${chapterName} - WebEbook chapter`;
      return {
        chapterName: chapterName,
        lines: JSON.parse(res.chapter[0]) as Array<string>,
      };
    },
    /**
     * @function
     * @async
     * @description 获取书本章节总数
     */
    getPageNum: function (): void {
      interface resType {
        // 章节总数
        clen: string;
      }

      superagent
        .get(`${ReLocal899EbookAjax}chapters.json`)
        .query({
          bid: this.bid,
        })
        .set("Accept", "application/json")
        .end((err, response) => {
          if (!err && response) {
            let res: resType = JSON.parse(response.text) as resType;
            this.pageNum = Number(res.clen);
          } else {
            alert("FAIL");
            this.pageNum = 0;
          }
        });
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
        this.localCid += process;
        // 更新地址栏
        history.replaceState(null, "", chapterUrl(this.bid, this.localCid));
        // 重置书本章节信息
        this.chapter = null;
        // 获取书本章节信息
        this.chapter = await this.getChapter();
      } else {
        return undefined;
      }
    },
    /**
     * @see jump_page_by_chapter_jump
     * @see jump_page_by_chapter_jump_end
     */
    jump_page_by_chapter_jump_end: async function (
      param: unknown
    ): Promise<void> {
      // 页面跳转数量
      const process: number = param as number;
      // 页面跳转
      await this.jumpCore(process);
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
      }
    },
  },
  mounted: async function (): Promise<void> {
    instance = getCurrentInstance();
    instance!.proxy!.$NativeEventBus.on(
      "jump_page_by_chapter_jump",
      this.jump_page_by_chapter_jump_end
    );
    window.addEventListener("keyup", this.keyupControl);
    // 获取书本章节总数
    this.getPageNum();
    // 获取书本章节信息
    this.chapter = await this.getChapter();
  },
  beforeUnmount() {
    instance!.proxy!.$NativeEventBus.off(
      "jump_page_by_chapter_jump",
      this.jump_page_by_chapter_jump_end
    );
    window.removeEventListener("keyup", this.keyupControl);
  },
});
</script>

<style lang="scss">
#chapter {
  @font-face {
    font-family: Fzpxht;
    src: url(/lib/font/FZPingXYSJW.TTF);
  }

  p {
    font-family: Fzpxht, serif;

    &.h3 {
      margin: 0;
      padding: 1.5em 0 0 0;
    }

    &.h4 {
      font-size: 1.3em;
      font-weight: lighter;
      text-indent: 2em;
      line-height: 1.8em;
      margin: 1.6em 0 1.9em 1em;
      word-break: break-word;
    }
  }
}
</style>
