<template>
  <div class="send" v-if="ex !== null" v-bind:class="ex ? 'ex' : 'nex'">
    <button class="insert" type="button" v-if="ex" disabled>存在</button>
    <button
      class="insert"
      type="button"
      v-else
      v-on:click="ex ? voidFun() : sendInsertUid()"
    >
      添加
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import superagent from "superagent";
import { getUidAll } from "@/../Js/PixivImage/IdDataRead";
import { ReLocal899Origin } from "@/../Js/PixivImage/urlRe";
import { urlMapReplace } from "@/../Js/PixivImage/urlMap";

export default defineComponent({
  name: "authorSendUid",
  props: {
    // uid
    uid: {
      type: String,
      required: true,
    },
    // 用户名
    author: {
      type: String,
      required: true,
    },
  },
  data(): {
    // 作者信息是否在服务器中存在
    ex: boolean | null;
  } {
    return {
      ex: null,
    };
  },
  methods: {
    // 空占用
    voidFun: (): void => undefined,
    /**
     * @function
     * @async
     * @description 获取作者信息是否在服务器中存在
     */
    async getEx(): Promise<void> {
      // 获取作者信息是否在服务器中存在
      this.ex = (await getUidAll()).indexOf(this.uid) !== -1;
    },
    /**
     * @function
     * @description 发送作者信息到服务器
     */
    sendInsertUid() {
      // http://localhost:899/pixivImage/ajax/UserInsert.json
      // 发送作者信息到服务器
      superagent
        .post(`${ReLocal899Origin}pixivImage/ajax/UserInsert.json`)
        .type("form")
        .send({
          // uid
          uid: this.uid,
          // 用户名
          name: urlMapReplace(this.author),
        })
        .end();
      // 已存在
      this.ex = true;
    },
  },
  async created() {
    // 获取作者信息是否在服务器中存在
    await this.getEx();
  },
});
</script>

<style lang="scss" scoped>
.send {
  display: inline-block;
  width: 6em;
  height: 6em;
  border-radius: 50%;
  margin-left: 2em;
  position: relative;
  top: -3em;

  &.nex {
    background: red;
  }

  &.ex {
    background: green;
  }

  .insert {
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
