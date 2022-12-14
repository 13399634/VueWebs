<template>
  <p class="line" v-bind:class="className">
    <slot></slot>
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "lineP",
  props: {
    // class
    className: {
      type: String,
      required: false,
    },
  },
});
</script>
