<template>
  <div>
    <div @contextmenu.prevent="$refs.ctxMenu.open" class="b-tab_content" ref="tabContent"></div>
    <context-menu ref="ctxMenu">
      <li @click="paste">Paste</li>
    </context-menu>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
import { Terminal } from "xterm";
import contextMenu from "vue-context-menu";

import {
  IPC_EVENTS,
  EventExistPayload,
  EventExistResult,
  IAskRequestPayload,
  IAskResponsePayload,
  ICmdResponsePayload,
  COMMAND_TYPE,
  IPrintRequestPayload,
  IExecuteCommandPayload,
  IAppInfo
} from "../../../commons/index";

const path = require("path");
export default Vue.extend({
  components: {
    contextMenu
  },
  props: {
    id: String
  },
  mounted() {
    const terminal = new Terminal();
    ipcRenderer.on(IPC_EVENTS.Data, (e, { tabId, data }) => {
      if (this.id === tabId) {
        terminal.write(data);
      }
    });
    terminal.onData(data => {
      this.sendData(data);
    });
    terminal.open(this.$refs.tabContent);
    ipcRenderer.send(IPC_EVENTS.NewTab, this.id);
  },
  methods: {
    sendData(data: string) {
      ipcRenderer.send(IPC_EVENTS.Data, {
        tabId: this.id,
        data
      });
    },
    async paste() {
      const copiedData = await navigator.clipboard.readText();
      console.log("copied", copiedData);
      if (copiedData.length > 0) {
        // this.terminal.write(copiedData);
        this.commandText += copiedData;
        this.sendData(copiedData);
      } else {
        alert("nothing to paste");
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.b-tab_content {
  // display: flex;
  // flex-direction: column;
  // padding: 15px 5px;
}
</style>