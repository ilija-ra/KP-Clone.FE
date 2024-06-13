import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      authenticated: false,
      role: null,
      userId: null,
    };
  },
  mutations: {
    SET_AUTH: (state, auth) => (state.authenticated = auth),
    SET_ROLE: (state, role) => {
      state.role = role;
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId;
    },
  },
  actions: {
    setAuth: ({ commit }, authenticated) => {
      commit("SET_AUTH", authenticated);
    },
    setRole: ({ commit }, role) => {
      commit("SET_ROLE", role);
    },
    setUserId: ({ commit }, userId) => {
      commit("SET_USER_ID", userId);
    },
  },
});

export default store;
