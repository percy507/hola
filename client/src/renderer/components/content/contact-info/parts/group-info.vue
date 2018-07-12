<template>
  <div class="group-info">
    <div class="info-head">
      <div class="avatar">
        <img :src="groupInfo.avatar"
             alt="avatar">
      </div>

      <div class="name">
        {{ groupInfo.nickname || groupInfo.uid }}
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
        <div class="item-title">
          <span>{{ infoTitles[item] }}</span>
          <div v-if="item === 'members'"
               class="member-count">{{ groupInfo[item] && groupInfo[item].length }}</div>
        </div>
        <div class="item-content">
          <div v-if="item !== 'members'">
            <span :class="{ 'default-content': !groupInfo[item] }">{{ groupInfo[item] ? groupInfo[item] : defaultInfoContent }}</span>
            <span v-if="isGroupOwner && (item === 'nickname' || item === 'group_info')"
                  class="icon icon-edit"></span>
          </div>
          <div v-else
               class="group-info-members">
            <group-member-item v-for="member in groupInfo.members"
                               :key="member.uid"
                               :data="member"></group-member-item>
          </div>
        </div>
      </div>

      <div class="group-not-active"
           v-if="!isGroupActive">
        群组已被解散
      </div>
    </div>

    <div class="info-foot">
      <span v-if="isGroupActive"
            class="icon icon-commenting"
            @click="readyToChat"></span>
      <span class="icon icon-delete"
            @click="leaveOrDissolveGroup"></span>
    </div>
  </div>
</template>

<script>
import GroupMemberItem from './parts/group-member-item';

export default {
  name: 'group-info',
  components: {
    GroupMemberItem
  },
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      titleArr: ['nickname', 'gid', 'createdAt', 'groupInfo', 'members'],
      groupInfo: {}
    };
  },
  computed: {
    infoTitles() {
      return this.$lang.contacts.group_info_titles;
    },
    defaultInfoContent() {
      return this.$lang.contacts.info_content.default;
    },
    isGroupOwner() {
      return this.$uid === this.groupInfo.ownerUid;
    },
    isGroupActive() {
      return this.groupInfo.status === 'active';
    }
  },
  watch: {
    id() {
      this.getGroupInfo();
    }
  },
  created() {
    this.getGroupInfo();
  },
  activated() {
    this.getGroupInfo();
  },
  methods: {
    getGroupInfo() {
      this.$socket.emit('get-group-info', this.id, data => {
        this.groupInfo = data;
      });
    },
    readyToChat() {
      let gid = this.groupInfo.gid;

      this.$store.commit('NEW_CHAT', { gid });
      this.$router.push({
        path: '/app/chats',
        query: {
          gid
        }
      });
    },
    leaveOrDissolveGroup() {
      let event = this.isGroupOwner ? 'dissolve-group' : 'leave-group';

      this.$socket.emit(event, { uid: this.$uid, gid: this.id }, data => {
        if (data.code === 0) {
          this.$store.commit('CURRENT_CONTACT', {
            isDefaultPage: true
          });
        }

        alert(data.message);
      });
    }
  }
};
</script>

<style lang="stylus">
.group-info {
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
      top: 64px;
      font-size: 24px;
      color: #DDD;
      letter-spacing: 0.17px;
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
    position: relative;
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

      .member-count {
        font-size: 10px;
        font-weight: normal;
        color: #787878;
        letter-spacing: 0.17px;
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

    .group-not-active {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 12;
      width: 100%;
      height: 300px;
      line-height: @height;
      text-align: center;
      background: rgba(200, 200, 200, 0.5);
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
