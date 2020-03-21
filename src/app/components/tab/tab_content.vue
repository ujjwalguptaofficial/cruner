<template>
  <div class="b-tab_content" @keyup.ctrl.67="onCtrlC">
    <div class="b-tab_content__line" v-for="line in lines" :key="line">
      <div class="b-tab_content__line__gt-symbol" v-if="shouldAddSymbol(line)">&gt;</div>
      <div class="b-tab_content__line__ask" v-if="shouldAddAskValue(line)">{{askValue}}</div>
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
  EventExistResult,
  IAskRequestPayload,
  IAskResponsePayload,
  ICmdResponsePayload,
  COMMAND_TYPE,
  IPrintRequestPayload
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
      linesWithoutSymbol: [],
      isCommandFinished: true,
      askValue: null,
      linesWithAskValue: []
    };
  },
  methods: {
    increaseLine() {
      this.lines++;
    },
    addMessage(msg: string) {
      Vue.nextTick(() => {
        this.linesWithoutSymbol.push(this.lines);
        this.$refs["textCmd"][this.lines - 1].innerText = msg;
        this.increaseLine();
      });
    },
    addError(msg: string) {
      Vue.nextTick(() => {
        this.linesWithoutSymbol.push(this.lines);
        this.$refs["textCmd"][this.lines - 1].innerText = msg;
        this.$refs["textCmd"][this.lines - 1].style.color = "#fd6666";
        this.increaseLine();
      });
    },
    shouldAddSymbol(val) {
      return this.linesWithoutSymbol.indexOf(val) < 0;
    },
    shouldAddAskValue(val) {
      return this.linesWithAskValue.indexOf(val) >= 0;
    },
    onCtrlC(e) {
      // console.log("copied");
      if (this.isCommandFinished === false) {
        e.preventDefault();
        ipcRenderer.send(IPC_EVENTS.KillCommand, {
          tabId: this.id
        } as EventExistPayload);
        this.addMessage("ctrl+c");
        // console.log("sent kill");
      }
    },
    onEnter() {
      const valueFromTextArea = this.$refs["textCmd"][this.lines - 1].innerText;
      ++this.lines;
      if (this.askValue != null) {
        ipcRenderer.send(IPC_EVENTS.CmdRequestFinished, {
          tabId: this.id,
          type: COMMAND_TYPE.Ask,
          result: valueFromTextArea
        } as ICmdResponsePayload);
      } else {
        const commandText = valueFromTextArea.trim(); //this.value;
        ipcRenderer.send(IPC_EVENTS.IsEventExist, {
          tabId: this.id,
          commandText: commandText,
          commandName: commandText.split(" ")[0]
        } as EventExistPayload);
      }
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
        this.addMessage("invalid Command - command not found");
      }
    },
    executeCommandCallBack(event, result) {
      // this.linesWithoutSymbol.push(this.lines);
      this.isCommandFinished = false;
      if (result.error) {
        this.addError(result.error);
      } else {
        this.addMessage(result.data);
      }
      // console.log(result);
    },
    executeCommandFinishedCallBack(event, result) {
      this.isCommandFinished = true;
      // console.log(result);
    },
    executeAsk(e, payload: IAskRequestPayload) {
      console.log(
        "payload",
        payload,
        this.isRequestBelongsToThisTab(payload.tabId)
      );
      // if (this.isRequestBelongsToThisTab(payload.tabId)) {
      // this.addMessage(payload.question);
      this.linesWithAskValue.push(this.lines);
      this.askValue = payload.question;
      // }
    },
    isRequestBelongsToThisTab(tabId: string) {
      return this.id === tabId;
    },
    executePrint(e, payload: IPrintRequestPayload) {
      console.log(
        "payload",
        payload,
        this.isRequestBelongsToThisTab(payload.tabId)
      );
      // if (this.isRequestBelongsToThisTab(payload.tabId)) {
      this.addMessage(payload.message);
      // this.linesWithAskValue.push(this.lines);
      // this.askValue = payload.message;
      // }
    }
  },
  mounted() {
    ipcRenderer.on(IPC_EVENTS.IsEventExist, this.onEventExistResult);
    ipcRenderer.on(IPC_EVENTS.ExecuteCommand, this.executeCommandCallBack);
    ipcRenderer.on(
      IPC_EVENTS.ExecuteCommandFinished,
      this.executeCommandFinishedCallBack
    );
    ipcRenderer.on(IPC_EVENTS.Ask, this.executeAsk);
    ipcRenderer.on(IPC_EVENTS.Print, this.executePrint);
  },
  destroyed() {
    ipcRenderer.off(IPC_EVENTS.IsEventExist, this.onEventExistResult);
    ipcRenderer.off(IPC_EVENTS.ExecuteCommand, this.executeCommandCallBack);
    ipcRenderer.off(
      IPC_EVENTS.ExecuteCommandFinished,
      this.executeCommandFinishedCallBack
    );
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
  // padding: 0 5px;
  padding-right: 5px;
  // margin-left: 5px;
  // width: 100%;
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

.b-tab_content__line__gt-symbol {
  padding-right: 5px;
}
.b-tab_content__line__ask {
  padding-right: 5px;
}
</style>