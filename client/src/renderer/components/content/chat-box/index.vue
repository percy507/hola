<template>
  <div class="chat-box"
       @click="hideGroupSidebar">
    <div v-if="currentChat.uid || currentChat.gid">
      <div class="chat-box-head">
        <span class="title">{{ contactInfo.alias || contactInfo.nickname || contactInfo.uid }}</span>

        <span v-show="isGroup"
              class="icon icon-users"
              @click.stop="showGroupSidebar"></span>
      </div>

      <div class="chat-box-content"
           ref="chatBoxContent">
        <message-item v-for="item in messageArr"
                      :key="item.uuid"
                      :message="item"></message-item>
      </div>

      <div class="chat-box-foot">
        <div>
          <div class="foot-tools">
            <span class="icon icon-happy2"
                  @click="openFaceDialog"></span>

            <span class="icon icon-photo_size_select_actual"
                  @click="openImageDialog"></span>

            <span v-show="!isGroup"
                  class="icon icon-folder"
                  @click="openFileDialog"></span>

            <span v-show="!isGroup"
                  class="icon icon-microphone"
                  @click="openVoiceChatDialog"></span>

            <span v-show="!isGroup"
                  class="icon icon-video-camera"
                  @click="openVideoChatDialog('call')"></span>
          </div>

          <div class="foot-input">
            <textarea v-model="message"
                      ref="textarea"
                      placeholder="请输入消息"
                      @compositionstart="detectCompositionInput(true)"
                      @compositionend="detectCompositionInput(false)"
                      @keydown.enter="sendTextMessage($event)"></textarea>
          </div>
        </div>
        <div>
          <span class="icon icon-send-o"
                @click="sendTextMessage"></span>
        </div>
      </div>

      <div v-if="isGroup"
           class="chat-box-group-sidebar"
           :class="{ 'show-group-sidebar': isShowGroupSidebar }"
           @click.stop>
        <div class="sidebar-head">
          <span class="sidebar-head__title">
            <span>{{ $lang.chat.groupMember }}</span>
            <span style="font-size:12px;">[{{ memberArr.length}}]</span>
          </span>
          <span class="icon icon-close"
                @click.stop="hideGroupSidebar"></span>
        </div>
        <div class="sidebar-content">
          <group-member-item v-for="member in memberArr"
                             :key="member.uid"
                             :data="member"
                             style="width:100%;"></group-member-item>
        </div>
      </div>
    </div>

    <div v-else>
      <default-page></default-page>
    </div>
  </div>
</template>

<script>
import DefaultPage from '../_parts/default-page';
import MessageItem from './parts/message-item';
import GroupMemberItem from '../contact-info/parts/parts/group-member-item';

export default {
  name: 'chat-box',
  components: {
    DefaultPage,
    MessageItem,
    GroupMemberItem
  },
  data() {
    return {
      contactInfo: {},
      isShowGroupSidebar: false,
      isCompositionInput: false,
      videoWindow: null,
      message: '',
      messageArr: []
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.Main.userInfo;
    },
    currentChat() {
      return this.$store.state.Chat.currentChat;
    },
    isGroup() {
      return this.currentChat.gid ? true : false;
    },
    memberArr() {
      return this.contactInfo.members || [];
    }
  },
  watch: {
    currentChat() {
      this.$nextTick(() => {
        if (this.$refs.textarea) {
          this.$refs.textarea.focus();
        }
      });

      this.messageArr = [];

      this.getContactInfo()
        .then(() => {
          this.getHistoryMessage();
        })
        .catch(err => {
          console.log(err);
        });
    },
    messageArr() {
      this.$nextTick(() => {
        if (this.$refs.chatBoxContent) {
          this.$refs.chatBoxContent.scrollTop = this.$refs.chatBoxContent.scrollHeight;
        }
      });
    }
  },
  created() {
    // TODO 时间比较紧，暂时在客户端这样分发消息
    // 这样做的局限是，无法全局监听消息，所以有新消息时，没法及时给出通知
    this.$socket.on('new-message', message => {
      const fromId = message.from;
      const toId = message.to;
      const isGroupMessage = message.to.startsWith('g');

      if (isGroupMessage && toId === this.contactInfo.gid) {
        this.messageArr.push(message);
      } else if (!isGroupMessage && fromId === this.currentChat.uid) {
        this.messageArr.push(message);
      }
    });

    this.$socket.on('request-video-chat', ({ from }) => {
      if (this.currentChat.uid === from) {
        this.openVideoChatDialog('pickUp');
      }
    });
  },
  methods: {
    getContactInfo() {
      return new Promise(resolve => {
        let event = this.isGroup ? 'get-group-info' : 'get-friend-info';
        let _idName = this.isGroup ? 'gid' : 'uid';
        let _id = this.currentChat[_idName];
        let queryObj = this.isGroup ? _id : { uid: this.$uid, friendUid: _id };

        this.$socket.emit(event, queryObj, data => {
          this.contactInfo = data;
          resolve();
        });
      });
    },
    getHistoryMessage() {
      let query = this.isGroup
        ? { gid: this.contactInfo.gid }
        : { uid: this.$uid, friendUid: this.contactInfo.uid };

      this.$socket.emit('get-history-message', query, data => {
        let messages = data.data;

        this.messageArr.push(...messages);
      });
    },

    showGroupSidebar() {
      this.isShowGroupSidebar = true;
    },

    hideGroupSidebar() {
      this.isShowGroupSidebar = false;
    },

    openFaceDialog() {
      // do something
      alert('待开发');
    },

    openImageDialog() {
      const dialog = this.$electron.remote.dialog;
      const option = {
        properties: ['openFile', 'multiSelections'],
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'png', 'gif']
          }
        ]
      };

      dialog.showOpenDialog(option, filePaths => {
        if (filePaths && filePaths.length) {
          filePaths.forEach(path => {
            if (path) {
              this.sendImage(path);
            }
          });
        }
      });
    },

    sendImage(path) {
      const fs = require('fs');
      const base64Data = fs.readFileSync(path, 'base64');

      this.$socket.emit('store-image', { base64Data }, data => {
        const message = {
          uuid: this.$generateUUID(),
          from: this.$uid,
          to: this.currentChat[this.isGroup ? 'gid' : 'uid'],
          type: 'image',
          content: {
            url: data.data.url
          }
        };

        this.sendMessage(message);
      });
    },

    openFileDialog() {
      // do something
      alert('待开发');
    },

    openVoiceChatDialog() {
      // do something
      alert('待开发');
    },

    openVideoChatDialog(type) {
      const BrowserWindow = this.$electron.remote.BrowserWindow;
      const devServer = `http://localhost:9080/#/video-chat?to=${
        this.contactInfo.uid
      }&type=${type}`;
      const winURL =
        process.env.NODE_ENV === 'development'
          ? devServer
          : `file://${__dirname}/index.html/#/video-chat?to=${
              this.contactInfo.uid
            }&type=${type}`;
      const config = {
        width: 600,
        height: 360,
        minWidth: 600,
        minHeight: 360,
        resizeable: false,
        useContentSize: true,
        titleBarStyle: 'hidden'
      };

      this.videoWindow = new BrowserWindow(config);

      this.videoWindow.on('closed', () => {
        if (type === 'call') {
          let message = {
            uuid: this.$generateUUID(),
            from: this.$uid,
            to: this.currentChat.uid,
            type: 'video',
            content: {
              text: '视频通话已结束'
            }
          };

          this.sendMessage(message);
        }

        this.videoWindow = null;
      });

      // force resize window with a constant ratio
      this.videoWindow.setAspectRatio(600 / 360);
      this.videoWindow.loadURL(winURL);
      this.videoWindow.show();
    },

    detectCompositionInput(value) {
      this.isCompositionInput = value;
    },

    sendTextMessage(e) {
      if (e.shiftKey || this.isCompositionInput) {
        // enter+shift  next line
        return;
      }

      e.preventDefault();

      if (!this.message.length) {
        return;
      }

      let message = {
        uuid: this.$generateUUID(),
        from: this.$uid,
        to: this.currentChat[this.isGroup ? 'gid' : 'uid'],
        type: 'text',
        content: {
          text: this.message
        }
      };

      this.sendMessage(message);
      this.message = '';
    },

    sendMessage(message) {
      this.$socket.send(message, data => {
        console.log(data.message);
      });

      this.messageArr.push(message);
    }
  }
};
</script>

<style lang="stylus">
icon-hover =
  color: #A8B0BA;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    color: #666;
  }

.chat-box {
  position: relative;
}

.chat-box-head {
  position: relative;
  width: 100%;
  height: $search-bar-height;
  padding: 0 20px;
  border-bottom: 1px solid #DDD;
  line-height: @height;

  .title {
    font-size: 16px;
    color: #666666;
    letter-spacing: 0.09px;
  }

  .icon {
    position: absolute;
    top: 0;
    right: 20px;
    z-index: 2;
    line-height: @height;
    {icon-hover};
  }
}

.chat-box-content {
  width: 100%;
  height: 390px;
  padding: 12px 20px;
  overflow-y: auto;
}

.chat-box-foot {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 110px;
  padding: 9px 20px 10px;
  border-top: 1px solid #DDD;

  .foot-tools {
    display: flex;
    width: 490px;
    margin-bottom: 12px;

    .icon {
      display: block;
      width: 18px;
      height: @width;
      margin-right: 12px;
      line-height: @height;
      font-size: @height;
      text-align: center;
      {icon-hover};
    }

    .icon-happy2 {
      transform: scale(0.92);
    }
  }

  .foot-input {
    width: 490px;
    height: 60px;

    textarea {
      display: block;
      width: 100%;
      height: 60px;
      border: none;
      border-radius: 4px;
      resize: none;
      background: none;
      font-size: 14px;
      color: #666;
      letter-spacing: 0.07px;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: #DDD;
        letter-spacing: 0.1px;
        font-weight: 200;
      }
    }
  }

  .icon-send-o {
    line-height: 90px;
    font-size: 35px;
    {icon-hover};
  }
}

.chat-box-group-sidebar {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  width: 240px;
  height: 550px;
  background: #FFFFFF;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: 0.2s;

  &.show-group-sidebar {
    transform: translateX(0);
  }

  .sidebar-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid #DDDDDD;

    &__title {
      font-size: 16px;
      color: #666666;
      letter-spacing: 0.04px;
    }

    .icon-close {
      font-size: 18px;
      color: #999999;
      cursor: pointer;
    }
  }

  .sidebar-content {
    height: 500px;
    overflow: auto;
  }
}
</style>
