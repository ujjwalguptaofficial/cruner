<template>
  <div class="b-terminal">
    <div class="b-terminal__tabs">
      <Tab :tabs="tabs" @new-tab="addNewTab" @header-clicked="handleHeaderClicked" />
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
      this.tabs.forEach(tab => {
        tab.isActive = false;
      });
      this.tabs.push({ id: getUniqId(), title: "New Tab", isActive: true });
      // this.tabs.push({ id: getUniqId(), title: "New Tab", isActive: false });
    },
    handleHeaderClicked(id) {
      this.tabs.forEach(tab => {
        tab.isActive = tab.id === id;
      });
    }
  },
  async mounted() {
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