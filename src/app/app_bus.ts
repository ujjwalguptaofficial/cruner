import Terminal from './components/terminal.vue';
import Vue from 'vue';
// Initiate vue app
export const vueApp = new Vue({
    el: '#app',
    // store: store,
    render: h => h(Terminal)
});