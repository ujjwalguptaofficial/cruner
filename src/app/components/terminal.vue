<template>
  <div class="b-terminal">
    <div class="b-terminal__tabs">
      <!-- <Tab v-for="(item,index) in tabs" :key="index">
        <template v-slot:title>{{item.title}}</template>
        <template v-slot:default>
          <p>A paragraph for the main content.</p>
          <p>And another one.</p>
        </template>
      </Tab>-->
      <Tab :tabs="tabs" @new-tab="addNewTab" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Tab from "./tab/index.vue";
import { getUniqId } from "../helpers/get_uniq_id";
export default Vue.extend({
  components: {
    Tab
  },
  data() {
    return {
      tabs: []
    };
  },
  methods: {
    addNewTab() {
      this.tabs.push({ id: getUniqId(), title: "New Tab", isActive: true });
    }
  },
  mounted() {
    this.addNewTab();
    console.log(this.tabs);
  }
});
</script>
<style lang="scss" scoped>
.b-terminal {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.b-terminal__tabs {
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>