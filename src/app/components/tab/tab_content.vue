<template>
  <div class="b-tab_content">
    <div>&gt;</div>
    <textarea class="b-tab_content__text-area" type="text" v-model="value"></textarea>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      value: ""
    };
  }
});
</script>
<style lang="scss" scoped>
.b-tab_content {
  display: flex;
  flex-direction: row;
  //   border: 1px solid;
  //   width: fit-content;
  padding: 4px;
}
.b-tab_content__text-area {
  margin-left: 5px;
  width: 100%;
  border: none;
  background: inherit;
  color: white;
  resize: none;
}
textarea#story {
  // other stuff
  -moz-appearance: none;
  outline: 0px none transparent;
}

textarea:focus,
input:focus {
  outline: 0;
}

*:focus {
  outline: 0;
}
</style>