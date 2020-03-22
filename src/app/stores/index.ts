import Vuex from "vuex";
import Vue from 'vue';
import state from "./state";
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: state,
    // mutations: {
    //     increment(state) {
    //         state.apps++
    //     }
    // }
})