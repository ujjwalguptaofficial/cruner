import Vuex from "vuex";
import Vue from 'vue';
import state from "./state";
import mutations from "./mutations";
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: state,
    mutations: mutations
    // mutations: {
    //     increment(state) {
    //         state.apps++
    //     }
    // }
})