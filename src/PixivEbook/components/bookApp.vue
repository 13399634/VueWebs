<template>
  <div id="book" v-if="book !== null">
    <book-info
      v-bind:book-name="book.name"
      v-bind:author="book.author"
      v-bind:description="book.description"
    ></book-info>
    <book-item
      v-for="chapter in book.chapters"
      v-bind:key="chapter.cid"
      v-bind:chapter-name="chapter.name"
      v-bind:cid="chapter.cid"
      v-bind:description="chapter.description"
      v-bind:uid="book.uid"
    ></book-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import superagent from "superagent";
import { sortChineseSNum } from "@/../Js/sorted";
import { ReLocal899EbookAjax } from "@/../Js/PixivEbook/urlRe";
// 书本信息
import BookInfo from "@/PixivEbook/components/bookInfo.vue";
// 章节信息
import BookItem from "@/PixivEbook/components/bookItem.vue";

// 章节信息
interface chapterInfoType {
  // 章节名
  name: string;
  // 章节 id
  cid: string;
  // 章节 简介
  description: Array<string>;
}

// 书本信息
interface bookInfoType {
  // 书本名
  name: string;
  // 作者名
  author: string;
  // 作者 id
  uid: string;
  // 书本 简介
  description: Array<string>;
  // 章节信息
  chapters: Array<chapterInfoType>;
}

export default defineComponent({
  name: "bookApp",
  components: { BookItem, BookInfo },
  props: {
    // 书本 id
    bid: {
      type: [String, Number],
      required: true,
    },
  },
  data: function (): {
    // 获取书本信息
    book: bookInfoType | null;
  } {
    return { book: null };
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取书本信息
     */
    getBook: async function (): Promise<bookInfoType> {
      interface resType {
        // 作者
        author: [string];
        // 书本 简介
        description: [string];
        // 章节 简介
        descriptions: Array<string>;
        // 章节 id
        ids: Array<string>;
        // 书本名
        title: [string];
        // 章节名
        titles: Array<string>;
        // 作者 id
        uid: [string];
      }

      let res: resType;
      try {
        let response: superagent.Response = await superagent
          .get(`${ReLocal899EbookAjax}book.json`)
          .query({ bid: this.bid })
          .set("accept", "text/json");
        res = response.body as resType;
      } catch (e) {
        // 页面数据不存在
        // 创建默认值
        return { description: [], author: "", chapters: [], name: "", uid: "" };
      }
      const chapterDescriptions = res.descriptions;
      const chapterNames = res.titles;
      const cids = JSON.parse(res.ids[0]);
      const order: Array<[string, number]> = [];
      // cid 规格化
      for (let i = 0; i < cids.length; i++) {
        order.push([cids[i], i]);
      }
      // cid 按数字、字母、汉字顺序排序
      order.sort((param1: [string, number], param2: [string, number]) =>
        sortChineseSNum(param1[0], param2[0])
      );
      // 章节信息
      const chapters: Array<chapterInfoType> = [];
      for (let i = 0; i < order.length; i++) {
        let cid2: string, index: number;
        [cid2, index] = order[i];
        chapters.push({
          cid: cid2,
          description: JSON.parse(chapterDescriptions[index]) as Array<string>,
          name: chapterNames[index],
        });
      }
      return {
        description: JSON.parse(res.description[0]) as Array<string>,
        author: res.author[0],
        chapters: chapters,
        name: res.title[0],
        uid: res.uid[0],
      };
    },
  },
  mounted: async function (): Promise<void> {
    // 获取书本信息
    this.book = await this.getBook();
    document.title = `${this.book.name} - ${this.book.author} - pixiv book`;
  },
});
</script>

<style lang="scss">
#book {
  .top {
    font-size: 1.8em;
    font-weight: bold;

    .author {
      font-weight: lighter;
    }
  }

  .h3 {
    font-size: 1.3em;

    a {
      color: darkslategrey;
      text-decoration: none;
    }
  }

  //.book {
  //  width: 1.05em;
  //  height: 1.05em;
  //  display: inline-block;
  //  background: aquamarine;
  //  color: slateblue;
  //  padding-left: 0.02em;
  //  margin: 0 0.4em 0 0.05em;
  //  border-radius: 0.5em;
  //}

  .chapter {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 45em;

    .cover-l {
      width: 12em;

      .cover a img {
        max-width: 12em;
        max-height: 15em;
      }
    }

    .description {
      width: 28em;

      div {
        text-indent: 2em;
      }
    }
  }
}
</style>
