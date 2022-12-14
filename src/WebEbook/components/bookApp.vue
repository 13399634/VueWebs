<template>
  <div id="book" v-if="book !== null">
    <book-info
      v-bind:description="book.descriptions"
      v-bind:author="book.author"
      v-bind:book-name="book.bookName"
    ></book-info>
    <book-item
      v-for="(chapterName, index) in book.chapterNames"
      v-bind:key="index"
      v-bind:bid="bid"
      v-bind:idx="index"
      v-bind:chapter-name="chapterName"
    ></book-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import superagent from "superagent";
import "@/../Js/stringReplace";
import { ReLocal899EbookAjax } from "@/../Js/WebEbook/urlRe";
// 书本目录信息
import BookInfo from "@/WebEbook/components/bookInfo.vue";
// 书本目录章节列表
import BookItem from "@/WebEbook/components/bookItem.vue";

// 书本目录信息
interface BookDataType {
  // 作者
  author: string;
  // 章节名
  chapterNames: Array<string>;
  // 简介
  descriptions: Array<string>;
  // 书名
  bookName: string;
}

export default defineComponent({
  name: "bookApp",
  components: { BookItem, BookInfo },
  props: {
    // 书本id
    bid: {
      type: [String, Number],
      required: true,
    },
  },
  data: function (): {
    // 书本目录信息
    book: BookDataType | null;
  } {
    return {
      book: null,
    };
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取书本目录信息
     */
    getBook: async function (): Promise<BookDataType> {
      interface resType {
        // 作者
        author: [string];
        // 章节名
        chapters: [string];
        // 简介
        description: [string];
        // 书名
        title: [string];
      }

      let res: resType;
      try {
        let response = await superagent
          .get(`${ReLocal899EbookAjax}book.json`)
          .query({
            bid: this.bid,
          })
          .set("accept", "text/json");
        res = response.body as resType;
      } catch (e) {
        // 页面数据不存在
        // 创建默认值
        return { author: "", bookName: "", chapterNames: [], descriptions: [] };
      }
      // 获取简介
      let description: Array<string> = res.description[0]
        .stringReplaceC2("<br/>", "<br />")
        .split("<br />");
      for (let i = description.length - 1; i >= 0; i--) {
        const desc: string = description[i].trim();
        if (desc.length === 0) {
          // 删除空行
          description.splice(i, 1);
        } else {
          description[i] = desc;
        }
      }
      return {
        author: res.author[0],
        bookName: res.title[0],
        chapterNames: JSON.parse(res.chapters[0]) as Array<string>,
        descriptions: description,
      };
    },
  },
  mounted: async function (): Promise<void> {
    // 获取书本目录信息
    this.book = await this.getBook();
    document.title = `${this.book.bookName} - ${this.book.author}  - WebEbook book`;
  },
});
</script>

<style lang="scss">
#book {
  .top {
    padding: 1em 0 0.4em 0;
    font-size: 3em;
    font-weight: bold;
  }
}
</style>
