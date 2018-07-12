<template>
  <div id="menu-chats">
    <div v-if="recentChatArr.length === 0"
         class="no-chat-object">
      暂无聊天对象
    </div>

    <chat-item v-for="item in recentChatArr"
               :key="item.uid || item.gid"
               :contactInfo="item"
               :isActive="activatedId === (item.uid || item.gid)"
               @active-item="setActiveId"></chat-item>
  </div>
</template>

<script>
import ChatItem from '../_parts/chat-item';

export default {
  name: 'menu-chats',
  components: {
    ChatItem
  },
  data() {
    return {
      recentChatArr: [],
      activatedId: null
    };
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  computed: {
    recentChatIdArr() {
      return this.$store.state.Chat.recentChatIdArr;
    }
  },
  watch: {
    recentChatIdArr() {
      this.getRecentChatInfo();
    },
    $route: {
      deep: true,
      handler() {
        const _idName = this.$route.query.gid ? 'gid' : 'uid';
        const _id = this.$route.query[_idName];

        this.setActiveId(_id);

        this.$store.commit('CURRENT_CHAT', {
          [_idName]: _id
        });
      }
    }
  },
  methods: {
    init() {
      this.getRecentChatInfo();
    },
    setActiveId(id) {
      this.activatedId = id;
    },
    getRecentChatInfo() {
      if (this.recentChatIdArr.length) {
        this.$socket.emit(
          'get-recent-chat-info',
          {
            uid: this.$uid,
            recentChatIdArr: this.recentChatIdArr
          },
          data => {
            this.recentChatArr = data.data || [];
          }
        );
      } else {
        this.recentChatArr = [];
      }
    }
  }
};
</script>

<style lang="stylus">
#menu-chats {
}

.no-chat-object {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #A7B0BB;
  opacity: 0.5;
}
</style>
