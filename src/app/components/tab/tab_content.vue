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
    const terminal = new Terminal();
    ipcRenderer.on(IPC_EVENTS.Data, (e, { tabId, data }) => {
      console.log("data", data);
      if (this.id === tabId) {
        terminal.write(data);
      }
    });
    terminal.onData(data =>
      ipcRenderer.send(IPC_EVENTS.Data, {
        tabId: this.id,
        data
      })
    );
    terminal.open(this.$refs.tabContent);
    ipcRenderer.send(IPC_EVENTS.NewTab, this.id);
  },
  methods: {}
});
</script>
<style lang="scss" scoped>
.b-tab_content {
  // display: flex;
  // flex-direction: column;
  // padding: 15px 5px;
}
</style>