<template>
  <div class="pic">
    <a
      v-bind:href="tar"
      target="_blank"
      v-on:mousedown="ex ? voidFun() : addLocalId()"
    >
      <div class="pir" v-if="ex">
        <div class="pif">old</div>
      </div>
      <img v-bind:src="url" v-bind:alt="title" class="img" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { setLocalId } from "@/../Js/PixivImage/LocalDataRead";

export default defineComponent({
  name: "workUpdatePic",
  props: {
    // id
    id: {
      type: String,
      required: true,
    },
    // 图片地址 small
    url: {
      type: String,
      required: true,
    },
    // 作品名
    title: {
      type: String,
      required: true,
    },
    // 浏览器中是否存在浏览数据
    old: {
      type: Boolean,
      required: true,
    },
  },
  data(): {
    // 本地 浏览器中是否存在浏览数据
    ex: boolean;
  } {
    return {
      ex: this.old,
    };
  },
  computed: {
    // 作品链接
    tar(): string {
      return `?id=${this.id}#/work`;
    },
  },
  methods: {
    // 空占用
    voidFun: (): void => undefined,
    /**
     * @function
     * @description 添加作品浏览数据到浏览器
     */
    addLocalId(): void {
      // 添加作品浏览数据到浏览器
      setLocalId(this.id);
      // 已浏览
      this.ex = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.pic {
  display: inline-block;
  width: 40%;
  margin: 2%;

  .pir {
    height: 0;
    width: 0;
    float: left;

    .pif {
      position: relative;
      top: 0.5em;
      left: 0.5em;
      font-size: 1.2em;
      font-weight: bold;
      color: deeppink;
      min-width: 1.4em;
      min-height: 1.28em;
      padding-right: 0.05em;
      padding-top: 0.17em;
      border: 0.3em solid green;
      border-radius: 50%;
      background: green;
    }
  }

  .img {
    width: 100%;
    height: 100%;
    min-width: 150px;
    min-height: 150px;
  }
}
</style>
