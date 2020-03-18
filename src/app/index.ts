import Vue from 'vue';
import "@fortawesome/fontawesome-free/css/all.css";
import "./styles/all.css";
// import { store } from './store/store';
import Terminal from './components/terminal.vue';

// Initiate vue app
var vueApp = new Vue({
    el: '#app',
    // store: store,
    render: h => h(Terminal)
});
