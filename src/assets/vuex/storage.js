import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userData: {}
  },

  actions: {
    userLogged ({commit}, user) {
      commit('USER_LOGGED', user);
    }
  },

  mutations: {
    USER_LOGGED (state, user) {
      let fromStorage = {
        username: localStorage.getItem('user_name'),
        email: localStorage.getItem('user_email'),
        api_url: localStorage.getItem('api_url')
      }
      state.userData = fromStorage;
    }
  },
});