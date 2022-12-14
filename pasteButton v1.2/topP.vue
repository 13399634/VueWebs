<template>
  <p class="top">
    <slot></slot>
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "topP",
});
</script>
