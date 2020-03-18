<template>
  <div class="b-tab__header">
    <slot name="title"></slot>
    <i class="fas fa-times b-tab__header__close-icon"></i>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    title: String
  }
});
</script>
<style lang="scss" scoped>
.b-tab__header {
  display: flex;
  flex-direction: row;
  border: 1px solid;
  width: fit-content;
  padding: 5px;
}
.b-tab__header__close-icon {
  margin-left: 10px;
  cursor: pointer;
}
</style>