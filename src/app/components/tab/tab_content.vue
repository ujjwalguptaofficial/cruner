<template>
  <div class="b-tab_content">
    <div class="b-tab_content__line" v-for="line in lines" :key="line">
      <div>&gt;</div>
      <div
        ref="textCmd"
        v-on:keydown.enter.prevent="onEnter"
        :contenteditable="line===lines"
        class="b-tab_content__text-area"
        v-focus-on-create
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
import { IPC_EVENTS, EventExistPayload } from "../../../commons/index";
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
      const commandText = this.$refs["textCmd"][this.lines - 1].innerText; //this.value;
      ++this.lines;
      ipcRenderer.send(IPC_EVENTS.IsEventExist, {
        tabId: this.id,
        commandName: commandText.split(" ")[0]
      } as EventExistPayload);
      // ipcRenderer.send("sss", "as");
    },
    onEventExistResult(event, args) {
      console.log("args", args);
      if (args.result === true) {
      } else {
        // this.lines++;
        Vue.nextTick(() => {
          this.$refs["textCmd"][this.lines - 1].innerText =
            "invalid Command - command not found";
          this.lines++;
        });
      }
    }
  },
  mounted() {
    ipcRenderer.on(IPC_EVENTS.IsEventExist, this.onEventExistResult);
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
  // height: 25px;
  margin-bottom: 5px;
}
.b-tab_content__text-area {
  padding: 0 5px;
  // margin-left: 5px;
  width: 100%;
  border: none;
  background: inherit;
  color: white;
  // resize: none;
  overflow: hidden;
  -moz-appearance: none;
  outline: 0px none transparent;
}

// textarea:focus,
// input:focus {
//   outline: 0;
// }

// *:focus {
//   outline: 0;
// }
</style>