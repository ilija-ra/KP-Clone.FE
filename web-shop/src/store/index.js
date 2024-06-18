import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      authenticated: false,
      role: null,
      userId: null,
      fullName: null,
      initials: null,
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
    SET_FULL_NAME: (state, fullName) => {
      state.fullName = fullName;
    },
    SET_INITIALS: (state, initials) => {
      state.initials = initials;
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
    setFullName: ({ commit }, fullName) => {
      commit("SET_FULL_NAME", fullName);
    },
    setInitials: ({ commit }, initials) => {
      commit("SET_INITIALS", initials);
    },
  },
});

export default store;
