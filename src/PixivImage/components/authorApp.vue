<template>
  <div>
    <author-user
      v-if="showUser"
      v-bind:author="user.author"
      v-bind:pic="user.pic"
    ></author-user>
    <author-send-uid
      v-if="showOther"
      v-bind:uid="user.uid"
      v-bind:author="user.author"
    ></author-send-uid>
    <author-content v-bind:uid="user.uid"></author-content>
  </div>
</template>

<script lang="ts">
import superagent from "superagent";
import { defineComponent } from "vue";

import { UrlParam } from "@/../Js/tools-getParam";
import { RePixivOrigin, RePximgOriginP } from "@/../Js/PixivImage/urlRe";
// 用户头像名字展示
import AuthorUser from "@/PixivImage/components/authorUser.vue";
// 发送uid到服务器中
import AuthorSendUid from "@/PixivImage/components/authorSendUid.vue";
// 用户作品展示
import AuthorContent from "@/PixivImage/components/authorContent.vue";

export default defineComponent({
  name: "authorApp",
  components: {
    AuthorContent,
    AuthorSendUid,
    AuthorUser,
  },
  data(): {
    // 页面加载 用户头像名字展示块
    showUser: boolean;
    // 页面加载 其他块 发送uid到服务器中
    showOther: boolean;
    user: {
      // uid
      uid: string;
      // 用户名
      author: string | null;
      // 头像图片地址
      pic: string | null;
    };
  } {
    // uid 不能为空
    let uid = UrlParam.get("uid");
    if (uid === null) {
      throw new SyntaxError();
    }
    return {
      showUser: false,
      showOther: false,
      user: {
        uid: uid,
        author: null,
        pic: null,
      },
    };
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取用户名 以及 头像图片地址
     */
    async getAuthor(): Promise<void> {
      let response;
      try {
        // https://www.pixiv.net/users/[xxx.number]/illustrations
        response = await superagent
          .get(`${RePixivOrigin}users/${this.user.uid}/illustrations`)
          .query({ lang: "zh" })
          .set("accept", "text/json");
      } catch (e) {
        throw new SyntaxError(e);
      }
      let body = response.text;
      // 用户名
      this.user.author = body.match(/"userId":"[^"]+","name":"([^"]+)"/i)![1];
      // 加载 发送uid到服务器中
      this.showOther = true;
      document.title = document.title.replace("{author}", this.user.author);
      // 头像图片地址
      this.user.pic = RePximgOriginP(body.match(/"imageBig":"([^"]+)"/i)![1]);
      // 加载 用户头像名字展示
      this.showUser = true;
    },
  },
  async created(): Promise<void> {
    document.title = "{author} - {page} - PixivImage author";
    // 获取用户名 以及 头像图片地址
    await this.getAuthor();
  },
});
</script>
