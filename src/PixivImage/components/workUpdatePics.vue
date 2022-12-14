<template>
  <div class="pics" v-if="ifs != null">
    <work-update-pic
      v-for="is in ifs"
      v-bind:key="is.id"
      v-bind:id="is.id"
      v-bind:url="is.url"
      v-bind:title="is.title"
      v-bind:old="is.old"
    ></work-update-pic>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

const superagent = require("superagent");
import { RePixivOrigin, RePximgOriginP } from "@/../Js/PixivImage/urlRe";
import { getLocalId } from "@/../Js/PixivImage/LocalDataRead";
// 单个 相关作品展示
import WorkUpdatePic from "@/PixivImage/components/workUpdatePic.vue";

// 单个 相关作品数据
interface IfsType {
  // id
  id: string;
  // 图片地址 small
  url: string;
  // 作品名
  title: string;
  // 浏览器中是否存在浏览数据
  old: boolean;
}

export default defineComponent({
  name: "workUpdatePics",
  components: { WorkUpdatePic },
  props: {
    // 作品的一些近期相关作品id
    other: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
  },
  data(): {
    // 相关作品数据
    ifs: Array<IfsType> | null;
  } {
    return {
      ifs: null,
    };
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取 相关作品数据
     */
    async getOther(): Promise<void> {
      let response;
      try {
        // https://www.pixiv.net/ajax/user/10/illusts?[ids[]=@xxx.number]
        response = await superagent
          .get(
            `${RePixivOrigin}ajax/user/10/illusts?ids[]=${this.other.join(
              "&ids[]="
            )}`
          )
          .query({
            lang: "zh",
          })
          .set("accept", "text/json");
      } catch (e) {
        // throw new SyntaxError(e);
        return;
      }
      let body: {
        // id
        [key: string]: {
          // 图片地址 small
          url: string;
          // 作品名
          title: string;
        };
      } = response.body["body"];
      // 相关作品数据
      let ov: Array<IfsType> = [];
      // 浏览器中浏览id数据
      let ids = `,${getLocalId()},`;
      // 遍历 作品的一些近期相关作品id
      for (let i = 0; i < this.other.length; i++) {
        // 相关作品id
        let id_: string = this.other[i];
        // key存在
        if (Object.prototype.hasOwnProperty.call(body, id_)) {
          let line: { url: string; title: string } = body[id_];
          ov.push({
            id: id_,
            url: RePximgOriginP(line["url"]),
            title: line["title"],
            old: ids.indexOf(`,${id_},`) !== -1,
          });
        }
      }
      // 提交
      this.ifs = ov;
    },
  },
  async created() {
    // 获取 相关作品数据
    await this.getOther();
  },
});
</script>
