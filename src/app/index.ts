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

Vue.directive('focus-on-create', {
    // Note: using Vue 1. In Vue 2, el would be a parameter
    bind: function (el) {
        Vue.nextTick(() => {
            el.focus();
        })
    }
})
