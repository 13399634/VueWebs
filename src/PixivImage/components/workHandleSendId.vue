<template>
  <div class="add" v-bind:class="baseClass" v-if="ex !== null">
    <button class="btn" type="button" v-if="ex" disabled>存在</button>
    <button
      class="btn"
      type="button"
      v-else
      v-on:click="ex ? voidFun() : sendInsertId()"
    >
      添加
    </button>
  </div>
</template>

<script lang="ts">
const superagent = require("superagent");
import { defineComponent, PropType } from "vue";
import { getIdAll } from "@/../Js/PixivImage/IdDataRead";
import { urlMapReplace } from "@/../Js/PixivImage/urlMap";
import { ReLocal899Origin } from "@/../Js/PixivImage/urlRe";

// 用户信息数据
interface UserType {
  // uid
  uid: string;
  // 用户名
  author: string;
}

export default defineComponent({
  name: "workHandleSendId",
  props: {
    // 作品id
    id: {
      type: String,
      required: true,
    },
    // 作品名称
    title: {
      type: String,
      required: true,
    },
    // 作品图片链接 origin
    org: {
      type: String,
      required: true,
    },
    // 作品图片数量
    page: {
      type: Number,
      required: true,
    },
    // 用户信息数据
    user: {
      type: Object as PropType<UserType>,
      required: true,
    },
  },
  data(): {
    // 作品信息是否储存在服务器中
    ex: boolean | null;
  } {
    return {
      ex: null,
    };
  },
  computed: {
    // 加载样式 区分作品信息是否储存在服务器中
    baseClass(): string {
      return this.ex ? "ex" : "nex";
    },
  },
  methods: {
    // 空占位
    voidFun: (): void => undefined,
    /**
     * @async
     * @function
     * @description 获取 作品信息是否储存在服务器中
     */
    async getEx(): Promise<void> {
      this.ex = (await getIdAll()).indexOf(this.id) !== -1;
    },
    /**
     * @async
     * @function
     * @description 向服务器发送作品信息并储存在服务器中
     */
    sendInsertId() {
      // http://loccalhost:899/pixivImage/ajax/WorkInsert.json
      // 向服务器发送作品信息
      superagent
        .post(`${ReLocal899Origin}pixivImage/ajax/WorkInsert.json`)
        .type("form")
        .send({
          uid: this.user.uid,
          author: urlMapReplace(this.user.author),
          id: this.id,
          title: urlMapReplace(this.title),
          url: this.org
            .replace("https://i.pximg.net/img-original/img/", "")
            .replace(this.id, "-")
            .replace("p0", "p*"),
          page: this.page,
        })
        .end();
      // 已发送
      this.ex = true;
    },
  },
  async created(): Promise<void> {
    await this.getEx();
  },
});
</script>

<style lang="scss" scoped>
.add {
  display: flow-root;
  width: 6em;
  height: 6em;
  border-radius: 50%;

  &.nex {
    background: red;
  }

  &.ex {
    background: green;
  }

  .btn {
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    background: rgba(0, 0, 0, 0);
    color: black;
    font-size: 2em;
    font-weight: bold;
  }
}
</style>
