import Terminal from './components/terminal.vue';
import Vue from 'vue';
import { store } from './stores/index';
// Initiate vue app
export const vueApp = new Vue({
    el: '#app',
    store: store,
    render: h => h(Terminal)
});