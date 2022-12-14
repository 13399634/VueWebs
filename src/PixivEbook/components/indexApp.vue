<template>
  <div id="index">
    <TopP>pixiv ebook - all</TopP>
    <index-item
      v-for="book in books"
      v-bind:key="book.sid"
      v-bind:author="book.author"
      v-bind:sid="book.sid"
      v-bind:title="book.title"
      v-bind:type="book.type"
    ></index-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import superagent from "superagent";
import { sortChineseSNum } from "@/../Js/sorted";
import { ReLocal899EbookAjax } from "@/../Js/PixivEbook/urlRe";
import TopP from "@/../pasteButton v1.2/topP.vue";
// 跳转行
import IndexItem from "@/PixivEbook/components/indexItem.vue";

// 书本导航数据
interface bookInfoType {
  // 作者
  author: string;
  // 展示 id
  sid: string;
  // 图书名
  title: string;
  // 书本类型
  type: string;
}

export default defineComponent({
  name: "indexApp",
  components: { TopP, IndexItem },
  data: function (): { books: null | Array<bookInfoType> } {
    return {
      books: null,
    };
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取书本导航数据
     */
    getBooks: async function (): Promise<Array<bookInfoType>> {
      interface resType {
        // 作者
        author: Array<string>;
        // 展示 id
        sid: Array<string>;
        // 图书名
        title: Array<string>;
        // 书本类型
        type: Array<string>;
      }

      let res: resType;
      try {
        let response = await superagent
          .get(`${ReLocal899EbookAjax}all.json`)
          .set("accept", "text/json");
        res = response.body as resType;
      } catch (e) {
        // 页面数据不存在
        // 创建默认值
        return [];
      }
      const sid = res.sid;
      const type = res.type;
      const title = res.title;
      const author = res.author;
      const order: Array<[string, number]> = [];
      // title 规格化
      for (let i = 0; i < title.length; i++) {
        order.push([title[i], i]);
      }
      // title 按数字、字母、汉字顺序排序
      order.sort((param1: [string, number], param2: [string, number]) =>
        sortChineseSNum(param1[0], param2[0])
      );
      // 书本导航数据
      const books: Array<bookInfoType> = [];
      for (let i = 0; i < order.length; i++) {
        let title2: string, index: number;
        [title2, index] = order[i];
        books.push({
          author: author[index],
          sid: sid[index],
          title: title2,
          type: type[index],
        });
      }
      return books;
    },
  },
  mounted: async function (): Promise<void> {
    // 获取书本导航数据
    this.books = await this.getBooks();
    document.title = `pixiv ebook index`;
  },
});
</script>

<style lang="scss">
#index {
  .top {
    font-size: 1.8em;
    font-weight: bold;
  }

  .h3 {
    font-size: 1.3em;

    a {
      color: darkslategrey;
      text-decoration: none;

      .book {
        width: 1.05em;
        height: 1.05em;
        display: inline-block;
        background: aquamarine;
        color: slateblue;
        padding-left: 0.02em;
        margin: 0 0.4em 0 0.05em;
        border-radius: 0.5em;
      }

      .author {
        font-weight: lighter;
      }
    }
  }
}
</style>
