const state = {
  userInfo: ''
};

const mutations = {
  SET_USERINFO(state, obj) {
    state.userInfo = obj;
  }
};

const actions = {
  someAsyncTask({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER');
  }
};

export default {
  state,
  mutations,
  actions
};
