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
import { mapState } from "vuex";
const path = require("path");
export default Vue.extend({
  components: {
    contextMenu
  },
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
    this.commandText = "";
    let shouldWriteInUi = true;
    const terminal = new Terminal();
    ipcRenderer.on(IPC_EVENTS.Data, (e, { tabId, data }) => {
      if (shouldWriteInUi === true && this.id === tabId) {
        terminal.write(data);
      }
    });
    terminal.onData(data => {
      // console.log("data client", data, data.length);
      // if (data === "\r") {
      //   const commandName = this.commandText.split(" ")[0];
      //   const savedApp: IAppInfo = this.apps.find(
      //     q => q.command === commandName
      //   );
      //   debugger;
      //   if (savedApp != null) {
      //     const cliArgs = this.commandText.replace(commandName, "");
      //     console.log("cmd", cliArgs);
      //     shouldWriteInUi = false;
      //     for (var i = 0, len = this.commandText.length; i < len; i++) {
      //       this.sendData("\b\u001b[K");
      //     }
      //     this.sendData("\r");

      //     this.sendData(
      //       // `${savedApp.target} ${path.join(savedApp.location, savedApp.main)}`
      //       `${savedApp.commandToRun} ${cliArgs}`
      //     );
      //     setTimeout(() => {
      //       shouldWriteInUi = true;
      //       this.sendData("\r");
      //       // this.sendData(`cd ${savedApp.location} && ${savedApp.run}\r`);
      //       // this.sendData(
      //       //   `${savedApp.target} ${savedApp.location}/${savedApp.main}\r`
      //       // );
      //     }, 100);

      //     // terminal.write("\b\u001b[K");
      //     // this.sendData(`cd ${savedApp.location} && ${savedApp.run}\r`);
      //     console.log(
      //       "replace cmd",
      //       `!!:gs/${savedApp.commandToRun}${cliArgs}/${this.commandText}/`
      //     );
      //     // this.sendData(
      //     //   `!!:gs/${savedApp.commandToRun}${cliArgs}/${this.commandText}/`
      //     // );
      //     this.commandText = "";

      //     return;
      //   }
      //   this.commandText = "";
      // } else {
      //   this.commandText += data;
      // }
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