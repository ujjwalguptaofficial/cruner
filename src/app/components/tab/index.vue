<template>
  <div class="b-tabs">
    <!-- <div v-for="tab in tabs" :key="tab.id"> -->
    <div class="b-tabs__header">
      <div class="b-tabs__header-item" v-for="tab in tabs" :key="tab.id">
        <TabHeader @click="makeTabActive(tab.id)">
          <template v-slot:title>{{tab.title}}</template>
        </TabHeader>
        <div @click="handleAddTabClick">
          <i class="fas fa-plus b-tabs__header-item__add-icon"></i>
        </div>
      </div>
    </div>
    <TabContent v-for="(tab,index) in tabs" :key="index" v-show="tab.isActive" :id="tab.id" />
    <!-- </div> -->
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
    },
    makeTabActive(id) {
      this.$emit("header-clicked", id);
    }
  }
});
</script>
<style lang="scss" scoped>
.b-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.b-tabs__header {
  display: flex;
  flex-direction: row;
}
.b-tabs__header-item {
  display: flex;
  flex-direction: row;
  cursor: pointer;

  &:not(:first-child) {
    margin-left: 10px;
  }
}
.b-tabs__header-item__add-icon {
  margin-left: 10px;
  padding-top: 5px;
  cursor: pointer;
}
</style>