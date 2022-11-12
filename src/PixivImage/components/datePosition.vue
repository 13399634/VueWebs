<template>
  <div class="search">
    <span class="top">日期：</span>
    <label>
      <input
        class="date"
        type="number"
        autofocus="autofocus"
        v-model.number.trim="date"
      />
    </label>
    <label>
      <input
        class="btn"
        type="button"
        value="定位"
        v-on:click="change_date_by_data_position"
      />
    </label>
  </div>
</template>

<script lang="ts">
import {
  getCurrentInstance,
  defineComponent,
  ComponentInternalInstance,
} from "vue";

let instance: ComponentInternalInstance | null;

export default defineComponent({
  name: "dataPosition",
  data(): { date: "" | number } {
    return {
      // 日期
      date: "",
    };
  },
  methods: {
    /**
     * @function
     * @description 日期定位 发起
     * @see change_date_by_data_position
     * @see change_date_by_data_position_end
     */
    change_date_by_data_position(): void {
      // 获取日期
      let date = this.date.toString();
      // 日期长度
      if (date.length === 8) {
        // 推送信息
        // date
        // date 日期
        instance!.proxy!.$NativeEventBus.emit(
          "change_date_by_data_position",
          date
        );
      }
    },
  },
  mounted(): void {
    instance = getCurrentInstance();
  },
});
</script>

<style lang="scss" scoped>
.search {
  text-align: center;

  .top,
  .date,
  .btn {
    font-size: 2em;
  }

  input {
    &[type="number"] {
      -moz-appearance: textfield;
    }

    &::-webkit-calendar-picker-indicator,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
    }
  }

  .data,
  .btn {
    border-right: 0;
    border-left: 0.01em solid gray;
    border-top: 0.01em solid gray;
    border-bottom: 0.01em solid gray;
  }

  .date {
    border-radius: 0.3em 0 0 0.3em;
    padding: 0 0 0 0.3em;
  }

  .btn {
    margin: 0 0 0 -0.17em;
    border-top-right-radius: 0.4em;
    border-bottom-right-radius: 0.4em;
    padding: 0;
    position: relative;
    top: 0;
    left: -0.01em;
    background: cyan;
    color: darkviolet;
  }
}
</style>
