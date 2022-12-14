<template>
  <div>
    <div id="date-flow">
      <index-item
        v-for="date in dates"
        v-bind:key="date"
        v-bind:date="date"
      ></index-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import superagent from "superagent";
import { allowOverFlow } from "@/../Js/allowOverFlow";
import { ReLocal899DailyAjax } from "@/../Js/DailyInfo/urlRe";
// 日期跳转
import IndexItem from "@/DailyInfo/components/indexItem.vue";

export default defineComponent({
  name: "indexFlow",
  components: { IndexItem },
  data: function (): {
    // 日期
    dates: Array<string> | null;
  } {
    return {
      dates: null,
    };
  },
  methods: {
    /**
     * @function
     * @async
     * @description 获取日期
     */
    getDates: async function (): Promise<Array<string>> {
      try {
        let response = await superagent
          .get(`${ReLocal899DailyAjax}all-date.json`)
          .set("accept", "text/json");
        return response.body as Array<string>;
      } catch (e) {
        // 页面数据不存在
        // 创建默认值
        return [];
      }
    },
  },
  mounted: async function (): Promise<void> {
    let nBody: HTMLElement = document.getElementById("nBody")!;
    let Top: HTMLElement = document.getElementById("top")!;
    let dateFlow: HTMLElement = document.getElementById("date-flow")!;

    function allowOverFlow2(): void {
      allowOverFlow(Top, dateFlow, nBody);
    }

    // 页面布局调整
    allowOverFlow2();
    window.addEventListener("resize", allowOverFlow2, false);
    // 获取日期
    this.dates = await this.getDates();
  },
});
</script>

<style lang="scss" scoped>
#date-flow {
  background: papayawhip;
  overflow: auto;
}
</style>
