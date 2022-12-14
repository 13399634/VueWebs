<template>
  <div>
    <p class="bookName">bookName: {{ title }}</p>
    <p class="total">total: {{ page }}</p>
    <label
      v-for="(size_, index) in sizes"
      v-bind:key="`size-${size_}`"
      v-bind:for="size_"
    >
      <input
        v-bind:id="size_"
        type="radio"
        name="size"
        v-bind:value="size_"
        v-model="size"
      />
      width: {{ sizet[index] }}[Q]
      <br />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "chapterWorkInfo",
  props: {
    // 作品 页数
    page: {
      type: Number,
      required: true,
    },
    // 作品名
    title: {
      type: String,
      required: true,
    },
  },
  data: function (): {
    // size
    size: string;
    // sizes
    sizes: Array<string>;
    // sizey
    sizet: Array<string>;
  } {
    return {
      size: "full",
      sizes: ["full", "limit-width"],
      sizet: ["Full", "100%"],
    };
  },
  methods: {
    bodyClassChange: function (): void {
      const classList: DOMTokenList = document.body.classList;
      for (let i = 0; i < this.sizes.length; i++) {
        const size: string = this.sizes[i];
        if (this.size == size) {
          if (!classList.contains(size)) {
            classList.add(size);
          }
        } else {
          if (classList.contains(size)) {
            classList.remove(size);
          }
        }
      }
    },
    keyupControl: function (ev: KeyboardEvent) {
      const ctrl: boolean = ev.ctrlKey;
      const alt: boolean = ev.altKey;
      const shift: boolean = ev.shiftKey;
      const key: string = ev.key;
      if (!ctrl && !alt && !shift) {
        if (key === "q") {
          const idx: number = this.sizes.indexOf(this.size) + 1;
          if (idx == this.sizes.length) {
            this.size = this.sizes[0];
          } else {
            this.size = this.sizes[idx];
          }
        }
      }
    },
  },
  watch: {
    size: {
      immediate: true,
      handler: function (): void {
        this.bodyClassChange();
      },
    },
  },
  mounted: function (): void {
    window.addEventListener("keyup", this.keyupControl);
  },
});
</script>

<style lang="scss" scoped>
div {
  .bookName,
  .total {
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
  }
}
</style>
