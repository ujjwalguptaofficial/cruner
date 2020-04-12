import Vue from 'vue';
import "@fortawesome/fontawesome-free/css/all.css";
import "./styles/all.css";
// import Vuex from "vuex";

import "./app_bus";
import "xterm/css/xterm.css";

Vue.directive('focus-on-create', {
    // Note: using Vue 1. In Vue 2, el would be a parameter
    bind: function (el) {
        Vue.nextTick(() => {
            el.focus();
        })
    }
})
