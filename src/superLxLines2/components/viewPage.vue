<template>
  <div class="page">
    <div class="page-title">
      <a v-bind:id="`page-${page.page}`" class="page-title-order">
        page-{{ page.page }}
      </a>
      <button class="write" v-on:click="edit_open_by_view_page">
        跳转编辑
      </button>
    </div>
    <view-line
      v-for="line in page.content"
      v-bind:key="`view-line-${page.id}-${line.id}`"
      v-bind:line="line"
    ></view-line>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  PropType,
} from "vue";
import { PageType } from "@/../Js/superLxLines2/page-type";
// 段落
import ViewLine from "@/superLxLines2/components/viewLine.vue";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "viewPage",
  components: { ViewLine },
  props: {
    // 页面数据
    page: {
      type: Object as PropType<PageType>,
      required: true,
    },
  },
  methods: {
    /**
     * @function
     * @description 编辑页面数据
     * @see edit_open_by_view_page
     * @see edit_open_by_view_page_end
     */
    edit_open_by_view_page: function () {
      // 交付要编辑的页面数据
      let page: PageType = this.page;
      instance!.proxy!.$NativeEventBus.emit("edit_open_by_view_page", page);
    },
  },
  mounted() {
    instance = getCurrentInstance();
  },
});
</script>

<style lang="scss" scoped>
.page-title {
  button {
    margin-left: 0.5em;
  }

  .page-title-order {
    display: inline-block;
    color: black;
    text-decoration: none;
    font-size: 1.6em;
    font-weight: bold;
    margin: 0.5em 0 0.8em 0;
  }
}
</style>
