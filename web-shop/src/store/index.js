import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      authenticated: false,
      role: null,
    };
  },
  mutations: {
    SET_AUTH: (state, auth) => (state.authenticated = auth),
    SET_ROLE: (state, role) => {
      state.role = role;
    },
  },
  actions: {
    setAuth: ({ commit }, authenticated) => {
      commit("SET_AUTH", authenticated);
    },
    setRole: ({ commit }, role) => {
      commit("SET_ROLE", role);
    },
  },
});

export default store;
