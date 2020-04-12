<template>
  <div class="b-tab_content" ref="tabContent"></div>
</template>
<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
import { Terminal } from "xterm";

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
import { mapState } from "vuex";
export default Vue.extend({
  props: {
    id: String
  },
  computed: {
    ...mapState(["apps"])
  },
  filters: {},
  created() {
    this.askValue = null;
  },
  data() {
    return {};
  },
  mounted() {
    let commandText = "";
    let shouldWriteInUi = true;
    const terminal = new Terminal();
    ipcRenderer.on(IPC_EVENTS.Data, (e, { tabId, data }) => {
      console.log("data", data);
      if (shouldWriteInUi === true && this.id === tabId) {
        terminal.write(data);
      }
    });
    terminal.onData(data => {
      console.log("data client", data);
      if (data === "\r") {
        const commandName = commandText.split(" ")[0];
        const savedApp = this.apps.find(q => q.command === commandName);
        if (savedApp != null) {
          shouldWriteInUi = false;
          for (var i = 0, len = commandText.length; i < len; i++) {
            this.sendData("\b\u001b[K");
          }
          setTimeout(() => {
            shouldWriteInUi = true;
            this.sendData("\r");
            // this.sendData(`cd ${savedApp.location} && ${savedApp.run}\r`);
            this.sendData(`${savedApp.target} ${savedApp.location}/${savedApp.main}\r`);
          }, 100);

          // terminal.write("\b\u001b[K");
          // this.sendData(`cd ${savedApp.location} && ${savedApp.run}\r`);
          return;
        }
        commandText = "";
      } else {
        commandText += data;
      }
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