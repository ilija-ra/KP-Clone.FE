import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      authenticated: false,
    };
  },
  mutations: {
    SET_AUTH: (state, auth) => (state.authenticated = auth),
  },
  actions: {
    setAuth: ({ commit }, authenticated) => {
      commit("SET_AUTH", authenticated);
    },
  },
});

export default store;
