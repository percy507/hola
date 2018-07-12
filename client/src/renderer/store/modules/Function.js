const state = {
  currentFunction: ''
};

const mutations = {
  CURRENT_FUNCTION(state, flag) {
    state.currentFunction = flag;
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
