<template>
  <div id="arr">
    <author-page-navigation-item
      v-for="m1 in model"
      v-bind:key="`${total}-${page}-${m1.page}`"
      v-bind:navigation-type="m1.type"
      v-bind:page="m1.page"
    ></author-page-navigation-item>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "vue";
import { sleep } from "@/../Js/tools-sleep";
import { navigation_model_create, NavigationType } from "@/../Js/navigation";
import AuthorPageNavigationItem from "@/PixivImage/components/authorPageNavigationItem.vue";

let instance: ComponentInternalInstance | null;
export default defineComponent({
  name: "authorPageNavigation",
  components: { AuthorPageNavigationItem },
  props: {
    // 当前页面
    page: {
      type: Number,
      required: true,
    },
    // 页面总数
    total: {
      type: Number,
      required: true,
    },
  },
  data(): {
    // 数据处理通信体
    wait: boolean;
    // 导航模型数据
    model: { type: NavigationType; page?: number }[];
  } {
    return {
      wait: false,
      model: navigation_model_create(this.page, this.total),
    };
  },
  methods: {
    /**
     * @function
     * @description 接收author_page_navigation_item页面发送的命令 初始化此页面 清空页面导航模型数据 并开始等待author_content页面发送的命令 进行下一步操作
     * @see authorPageNavigationItem
     */
    page_jump_by_author_page_navigation_item_end_2(): void {
      // 清空页面导航模型数据
      this.model = [];
      // 初始化此页面已完成 开始等待author_content页面发送的命令 进行下一步操作
      this.wait = true;
    },
    /**
     * @function
     * @async
     * @description 接收author_content页面发送的命令 重新加载页面导航模型数据
     * @see authorPageNavigationItem
     * @see page_jump_by_author_page_navigation_item_end_1
     * @see page_jump_by_author_content_end
     */
    async page_jump_by_author_content_end(): Promise<void> {
      for (let i = 10; ; i++) {
        if (this.wait) {
          // 重新获取页面导航模型
          this.model = navigation_model_create(this.page, this.total);
          // 页面导航模型已重新获取 等待状态停止 关闭接收状态
          this.wait = false;
          break;
        }
        await sleep(50 * i);
      }
    },
  },
  mounted() {
    instance = getCurrentInstance();
    /**
     * @see page_jump_by_author_page_navigation_item
     * @see page_jump_by_author_page_navigation_item_end_1
     * @see page_jump_by_author_page_navigation_item_end_2
     */
    instance!.proxy!.$NativeEventBus.on(
      "page_jump_by_author_page_navigation_item",
      this.page_jump_by_author_page_navigation_item_end_2
    );
    /**
     * @see page_jump_by_author_content
     * @see page_jump_by_author_content_end
     */
    instance!.proxy!.$NativeEventBus.on(
      "page_jump_by_author_content",
      this.page_jump_by_author_content_end
    );
  },
  beforeUnmount() {
    instance!.proxy!.$NativeEventBus.on(
      "page_jump_by_author_page_navigation_item",
      this.page_jump_by_author_page_navigation_item_end_2
    );
    instance!.proxy!.$NativeEventBus.off(
      "page_jump_by_author_content",
      this.page_jump_by_author_content_end
    );
  },
});
</script>

<style lang="scss" scoped>
#arr {
  text-align: center;
  white-space: nowrap;
  margin: 1em 0 10em 0;
  height: 4em;
}
</style>
