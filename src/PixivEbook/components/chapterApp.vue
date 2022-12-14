<template>
  <div id="chapter" v-if="chapter !== null">
    <chapter-info
      v-bind:author="chapter.author"
      v-bind:cid="cid"
      v-bind:descriptions="chapter.description"
      v-bind:chapter-name="chapter.name"
      v-bind:tags="chapter.tags"
      v-bind:uid="chapter.uid"
    ></chapter-info>
    <chapter-item
      v-for="(line, index) in chapter.lines"
      v-bind:key="index"
      v-bind:uid="chapter.uid"
      v-bind:cid="cid"
      v-bind:line="line"
    ></chapter-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import superagent from "superagent";
import { ReLocal899EbookAjax } from "@/../Js/PixivEbook/urlRe";
// 章节信息
import ChapterInfo from "@/PixivEbook/components/chapterInfo.vue";
// 章节段落
import ChapterItem from "@/PixivEbook/components/chapterItem.vue";

// 章节信息
interface chapterInfoType {
  // 章节名
  name: string;
  // 章节 段落
  lines: Array<string>;
  // 章节 简介
  description: Array<string>;
  // 章节 标签
  tags: Array<string>;
  // 作者
  author: string;
  // 作者 id
  uid: string;
}

export default defineComponent({
  name: "chapterApp",
  components: { ChapterItem, ChapterInfo },
  props: {
    // 章节 id
    cid: {
      type: [String, Number],
      required: true,
    },
  },
  data: function (): {
    // 获取章节信息
    chapter: chapterInfoType | null;
  } {
    return { chapter: null };
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取章节信息
     */
    getChapter: async function (): Promise<chapterInfoType> {
      interface resType {
        // 章节名
        title: string;
        // 章节 id
        id: [string];
        // 章节 段落
        content: Array<string>;
        // 章节 简介
        description: Array<string>;
        // 章节 标签
        tags: Array<string>;
        // 作者
        author: [string];
        // 作者 id
        uid: [string];
      }

      let res: resType;
      try {
        let response: superagent.Response = await superagent
          .get(`${ReLocal899EbookAjax}chapter.json`)
          .query({ id: this.cid })
          .set("accept", "text/json");
        res = response.body as resType;
      } catch (e) {
        // 页面数据不存在
        // 创建默认值
        return {
          lines: [],
          tags: [],
          description: [],
          author: "",
          name: "",
          uid: "",
        };
      }
      return {
        lines: JSON.parse(res.content[0]) as Array<string>,
        tags: JSON.parse(res.tags[0]) as Array<string>,
        description: JSON.parse(res.description[0]) as Array<string>,
        author: res.author[0],
        name: res.title[0],
        uid: res.uid[0],
      };
    },
  },
  mounted: async function (): Promise<void> {
    // 获取章节信息
    this.chapter = await this.getChapter();
    document.title = `${this.chapter.name} - ${this.chapter.author} - pixiv chapter`;
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
  }

  .top {
    font-size: 1.5em;
    font-weight: bold;

    #author {
      font-size: 0.85em;
    }
  }

  .h4 {
    font-size: 1.3em;
    font-weight: lighter;
    text-indent: 2em;
    line-height: 1.8em;
    margin: 1.6em 0 1.9em 1em;
    word-break: break-word;
  }

  .line {
    font-weight: bold;
    text-indent: 2em;
    font-size: 1.3em;
    line-height: 1.8em;
  }

  .img-z {
    text-indent: 0;
    text-align: center;
    width: 100%;
  }

  img {
    max-height: 30em;
    max-width: 32em;
    border: 3px solid black;
    margin: 0 auto;
  }

  #cover img {
    display: block;
    max-height: 40em;
    margin: 0 auto;
    border: 0;
    width: auto;
    text-align: center;
  }

  .tag {
    display: inline-flex;
    margin: 0.1em 0.2em;
    padding: 0.21em 0.4em;
    background: aqua;
    border-radius: 0.6em;
    font-size: 1.1em;
  }

  hr {
    margin: 3em 0;
    border-width: 0;
    border-top-width: 0.4em;
    border-left-width: 0.5em;
    border-bottom-width: 0.5em;
  }

  .h4r:nth-of-type(even) hr {
    transform: rotate(180deg);
  }

  .hr {
    text-align: justify;
    text-align-last: justify;
    text-justify: distribute-all-lines;
    font-size: 2em;
    font-weight: bold;
  }
}
</style>
