const state = {
  currentCategoryId: '',
  currentContact: ''
};

const mutations = {
  SET_CURRENT_CATEGORY_ID(state, id) {
    // 1234
    state.currentCategoryId = id;
  },
  CURRENT_CONTACT(state, obj) {
    // {
    //   id: 1234,
    //   isGroup: false
    // }
    state.currentContact = obj;
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
