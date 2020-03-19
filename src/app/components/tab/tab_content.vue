<template>
  <div class="b-tab_content">
    <div class="b-tab_content__line" v-for="line in lines" :key="line">
      <div>&gt;</div>
      <textarea
        v-on:keyup.enter="onEnter"
        :disabled="line<lines.length"
        class="b-tab_content__text-area"
        type="text"
        v-model="value"
      ></textarea>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
// import { ipcRenderer } from "electron";
import { IPC_EVENTS, EventExistPayload } from "../../../commons";
export default Vue.extend({
  props: {
    id: String
  },
  data() {
    return {
      value: "",
      lines: 1
    };
  },
  methods: {
    onEnter() {
      const commandText = this.value;
      ++this.lines;
    //   ipcRenderer.send(IPC_EVENTS.IsEventExist, {
    //     tabId: this.id,
    //     commandName: commandText.split(" ")[0]
    //   } as EventExistPayload);
    },
    onEventExistResult(event, args) {
      console.log("args", args);
    }
  },
  mounted() {
    // ipcRenderer.on(IPC_EVENTS.IsEventExist, this.onEventExistResult);
  }
});
</script>
<style lang="scss" scoped>
.b-tab_content {
  display: flex;
  flex-direction: column;
  padding: 15px 5px;
}
.b-tab_content__line {
  display: flex;
  flex-direction: row;
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