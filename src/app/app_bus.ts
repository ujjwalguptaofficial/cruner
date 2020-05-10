import Terminal from './components/terminal.vue';
import Vue from 'vue';

// Initiate vue app
export const vueApp = new Vue({
    el: '#app',
    render: h => h(Terminal)
});