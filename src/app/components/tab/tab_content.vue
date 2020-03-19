<template>
  <div class="b-tab_content">
    <div class="b-tab_content__line" v-for="line in lines" :key="line">
      <div v-if="shouldAddSymbol(line)">&gt;</div>
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
import {
  IPC_EVENTS,
  EventExistPayload,
  EventExistResult
} from "../../../commons/index";
export default Vue.extend({
  props: {
    id: String
  },
  filters: {},
  data() {
    return {
      value: "",
      lines: 1,
      linesWithoutSymbol: []
    };
  },
  methods: {
    addMessage(msg: string) {
      Vue.nextTick(() => {
        this.linesWithoutSymbol.push(this.lines);
        this.$refs["textCmd"][this.lines - 1].innerText = msg;
        this.lines++;
      });
    },
    addError(msg: string) {
      Vue.nextTick(() => {
        this.linesWithoutSymbol.push(this.lines);
        this.$refs["textCmd"][this.lines - 1].innerText = msg;
        this.$refs["textCmd"][this.lines - 1].style.color = "#fd6666";
        this.lines++;
      });
    },
    shouldAddSymbol(val) {
      return this.linesWithoutSymbol.indexOf(val) < 0;
    },
    onEnter() {
      const commandText = this.$refs["textCmd"][
        this.lines - 1
      ].innerText.trim(); //this.value;
      ++this.lines;
      ipcRenderer.send(IPC_EVENTS.IsEventExist, {
        tabId: this.id,
        commandText: commandText,
        commandName: commandText.split(" ")[0]
      } as EventExistPayload);
      // ipcRenderer.send("sss", "as");
    },
    onEventExistResult(event, args: EventExistResult) {
      console.log("args", args);
      if (args.tabId !== this.id) {
        return;
      }
      if (args.result === true) {
        ipcRenderer.send(IPC_EVENTS.ExecuteCommand, {
          commandText: args.commandText,
          tabId: args.tabId
        });
      } else {
        // Vue.nextTick(() => {
        //   this.linesWithoutSymbol.push(this.lines);
        //   this.$refs["textCmd"][this.lines - 1].innerText =
        //     "invalid Command - command not found";
        //   this.lines++;
        // });
        this.addMessage("invalid Command - command not found");
      }
    },
    executeCommandCallBack(event, result) {
      // this.linesWithoutSymbol.push(this.lines);
      if (result.error) {
        this.addError(result.error);
      } else {
        this.addMessage(result.data);
      }
      // console.log(result);
    }
  },
  mounted() {
    ipcRenderer.on(IPC_EVENTS.IsEventExist, this.onEventExistResult);
    ipcRenderer.on(IPC_EVENTS.ExecuteCommand, this.executeCommandCallBack);
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