const state = {
  currentChat: '',
  recentChatIdArr: []
};

const getters = {
  //
};

const mutations = {
  CURRENT_CHAT(state, obj) {
    state.currentChat = obj;
  },
  LOAD_RECENT_CHAT(state) {
    let key = 'recentChatIdArr';
    let recentChatIdArr = JSON.parse(localStorage.getItem(key)) || [];

    state.recentChatIdArr = recentChatIdArr;
  },
  NEW_CHAT(state, chatObj) {
    let key = 'recentChatIdArr';
    let recentChatIdArr = JSON.parse(localStorage.getItem(key)) || [];
    let _idName = chatObj.uid ? 'uid' : 'gid';
    let _id = chatObj[_idName];
    let isIdExist = false;

    recentChatIdArr.forEach(el => {
      if (el[_idName] === _id) {
        isIdExist = true;
      }
    });

    if (!isIdExist) {
      recentChatIdArr.push(chatObj);
    }

    localStorage.setItem(key, JSON.stringify(recentChatIdArr));
    state.recentChatIdArr = recentChatIdArr;
  },
  DELETE_CHAT(state, chatObj) {
    let key = 'recentChatIdArr';
    let recentChatIdArr = JSON.parse(localStorage.getItem(key)) || [];
    let _idName = chatObj.uid ? 'uid' : 'gid';
    let _id = chatObj[_idName];
    let deleteIndex;

    recentChatIdArr.find((el, index) => {
      if (el[_idName] === _id) {
        deleteIndex = index;
        return true;
      }
      return false;
    });

    // delete the target chat
    if (deleteIndex >= 0) {
      recentChatIdArr.splice(deleteIndex, 1);
    }

    localStorage.setItem(key, JSON.stringify(recentChatIdArr));
    state.recentChatIdArr = recentChatIdArr;
  }
};

const actions = {
  someAsyncTask({
    commit
  }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER');
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
