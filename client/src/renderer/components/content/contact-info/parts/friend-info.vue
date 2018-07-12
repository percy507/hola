<template>
  <div class="friend-info">
    <div class="info-head">
      <div class="avatar">
        <img :src="friendInfo.avatar"
             alt="avatar">
      </div>

      <div class="name">
        {{ friendInfo.nickname || friendInfo.uid }}
      </div>

      <div class="self-signature">
        {{ friendInfo.signature }}
      </div>

      <div class="info-background">
        <img src="../../../../assets/info-bg.png"
             alt="background">
      </div>
    </div>

    <div class="info-details">
      <div class="detail-item"
           v-for="item in titleArr"
           :key="item">
        <div class="item-title">{{ infoTitles[item] }}</div>
        <div class="item-content">
          <span :class="{ 'default-content': !friendInfo[item] }">{{ friendInfo[item] ? friendInfo[item] : defaultInfoContent }}</span>
          <span v-if="item==='alias'"
                class="icon icon-edit"></span>
        </div>
      </div>
    </div>

    <div class="info-foot">
      <span class="icon icon-commenting"
            @click="readyToChat"></span>
      <span class="icon icon-delete"
            @click="deleteFriend"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'friend-info',
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      titleArr: [
        'alias',
        'phone',
        'gender',
        'age',
        'email',
        'birthTime',
        'address',
        'selfIntro'
      ],
      friendInfo: {}
    };
  },
  computed: {
    infoTitles() {
      return this.$lang.contacts.friend_info_titles;
    },
    defaultInfoContent() {
      return this.$lang.contacts.info_content.default;
    }
  },
  watch: {
    id() {
      this.getFriendInfo();
    }
  },
  created() {
    this.getFriendInfo();
  },
  activated() {
    this.getFriendInfo();
  },
  methods: {
    getFriendInfo() {
      this.$socket.emit(
        'get-friend-info',
        {
          uid: this.$uid,
          friendUid: this.id
        },
        data => {
          this.friendInfo = data;
        }
      );
    },
    readyToChat() {
      let uid = this.friendInfo.uid;

      this.$store.commit('NEW_CHAT', { uid });
      this.$router.push({
        path: '/app/chats',
        query: {
          uid
        }
      });
    },
    deleteFriend() {
      this.$socket.emit(
        'delete-friend',
        {
          uid: this.$uid,
          friendUid: this.id
        },
        data => {
          if (data.code === 0) {
            this.$store.commit('CURRENT_CONTACT', {
              isDefaultPage: true
            });
          }

          alert(data.message);
        }
      );
    }
  }
};
</script>

<style lang="stylus">
.friend-info {
  position: relative;

  .info-head {
    position: relative;
    width: 100%;
    height: 173px;
    background: #414952;
    overflow: hidden;

    &>div {
      position: absolute;
      z-index: 3;
    }

    .avatar {
      left: 120px;
      top: 30px;
      width: 100px;
      height: @width;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .name {
      left: 250px;
      top: 45px;
      font-size: 24px;
      color: #DDD;
      letter-spacing: 0.17px;
      word-break: break-all;
    }

    .self-signature {
      left: 250px;
      top: 85px;
      width: 310px;
      font-size: 12px;
      color: #BBB;
      letter-spacing: 0.09px;
      line-height: 1.5;
      word-break: break-all;
    }

    .info-background {
      bottom: 0;
      z-index: 2;
      display: block;
      width: 100%;
      height: 67px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .info-details {
    width: 100%;
    height: 300px;
    overflow-y: auto;
    margin: 30px 0 10px;
    padding: 0 20px;

    .detail-item {
      display: flex;
      margin-bottom: 5px;
      font-size: 12px;
      color: #666666;
      letter-spacing: 0.17px;

      .item-title {
        flex-shrink: 0;
        width: 60px;
        font-weight: bold;
      }

      .item-content {
        width: 485px;
        word-break: break-all;

        .default-content {
          color: #dfdcdc;
        }

        .icon {
          margin-left: 10px;
          color: #A7B0BB;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;

          &:hover {
            color: #686868;
          }
        }
      }
    }
  }

  .info-foot {
    position: absolute;
    bottom: 0;
    z-index: 2;
    width: 100%;
    height: 45px;

    .icon {
      position: absolute;
      bottom: 10px;
      z-index: 3;
      display: block;
      width: 24px;
      height: @width;
      line-height: @height;
      text-align: center;
      font-size: 20px;
      color: #A7B0BB;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        color: #686868;
      }
    }

    .icon-commenting {
      right: 54px;
    }

    .icon-delete {
      font-size: 22px;
      right: 20px;
    }
  }
}
</style>
