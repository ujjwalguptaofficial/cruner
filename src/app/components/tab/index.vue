<template>
  <div class="b-tab">
    <!-- <div v-for=""> -->
    <div class="b-tab__header-item">
      <TabHeader v-for="(tab,index) in tabs" :key="index">
        <template v-slot:title>{{tab.title}}</template>
      </TabHeader>
      <div @click="handleAddTabClick">
        <i class="fas fa-plus b-tab__header-item__add-icon"></i>
      </div>
    </div>
    <TabContent />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import TabHeader from "./tab_header.vue";
import TabContent from "./tab_content.vue";
export default Vue.extend({
  components: {
    TabHeader,
    TabContent
  },
  props: {
    tabs: Array
  },
  methods: {
    handleAddTabClick() {
      this.$emit("new-tab");
    }
  }
});
</script>
<style lang="scss" scoped>
.b-tab {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.b-tab__header-item {
  display: flex;
  flex-direction: row;
}
.b-tab__header-item__add-icon {
  margin-left: 10px;
  padding-top: 5px;
  cursor: pointer;
}
</style>