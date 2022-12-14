<template>
  <div id="root" v-if="books !== null">
    <TopP>
      <template #default>eBook</template>
    </TopP>
    <all-book
      v-for="{ author, bid, bookName } in books"
      v-bind:key="bid"
      v-bind:bid="bid"
      v-bind:author="author"
      v-bind:book-name="bookName"
    ></all-book>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import superagent from "superagent";
import { ReLocal899EbookAjax } from "@/../Js/WebEbook/urlRe";
import { sortChineseSNum } from "@/../Js/sorted";
// 书本信息列表
import allBook from "@/WebEbook/components/allBook.vue";
import TopP from "@/../pasteButton v1.2/topP.vue";

interface BookInfoType {
  bid: string;
  author: string;
  bookName: string;
}

export default defineComponent({
  name: "allApp",
  components: { TopP, allBook },
  data: function (): {
    books: Array<BookInfoType> | null;
  } {
    return {
      books: null,
    };
  },
  methods: {
    getBooks: async function (): Promise<Array<BookInfoType>> {
      interface resType {
        author: Array<string>;
        bid: Array<string>;
        title: Array<string>;
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
        return [{ author: "", bookName: "", bid: "0" }];
      }
      let books: Array<BookInfoType> = [];
      let bid: Array<string> = res.bid;
      let title: Array<string> = res.title;
      let author: Array<string> = res.author;
      let rLen: number = bid.length;
      let titleSort: Array<[string, number]> = [];
      for (let i = 0; i < rLen; i++) {
        titleSort.push([title[i], i]);
      }
      // 脑瘫开发者 疯狂限制ts适用范围
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      titleSort.sort((p1: [string, number], p2: [string, number]): number =>
        sortChineseSNum(p1[0], p2[0])
      );
      for (let index = 0; index < rLen; index++) {
        const titleMp: [string, number] = titleSort[index];
        const i: number = titleMp[1];
        books.push({
          author: author[i],
          bid: bid[i],
          bookName: titleMp[0],
        });
      }
      return books;
    },
  },
  mounted: async function (): Promise<void> {
    this.books = await this.getBooks();
    document.title = "WebEbook index";
  },
});
</script>

<style lang="scss">
#root {
  .top {
    padding: 1em 0 0.4em 0;
    font-size: 3em;
    font-weight: bold;
  }
}
</style>

<style lang="scss">
#root {
  .top {
    padding: 1em 0 0.4em 0;
    font-size: 3em;
    font-weight: bold;
  }
}
</style>
