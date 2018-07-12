<template>
  <div class="chat-item"
       :class="{active : isActive}"
       @click="activeFunc">
    <div class="avatar">
      <img :src="contactInfo.avatar"
           alt="avatar">
    </div>

    <div class="detail">
      <div v-if="isGroup && isGroupDissolve"
           class="group-dissolve">
        {{ $lang.sidebar.groupDissolve }}
      </div>
      <div v-else>
        <div class="name">
          <span class="icon icon-users"
                v-if="isGroup"></span>{{ contactInfo.alias || contactInfo.nickname || contactInfo.uid }}
        </div>
        <div class="last-message">
          {{ contactInfo.lastMessage }}
        </div>
      </div>
    </div>

    <div class="delete-chat"
         @click.stop="deleteChat">
      <span class="icon icon-close"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chat-item',
  props: {
    contactInfo: {
      required: true,
      type: Object
    },
    isActive: {
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    _id() {
      return this.contactInfo.uid || this.contactInfo.gid;
    },
    _idName() {
      return this.contactInfo.uid ? 'uid' : 'gid';
    },
    isGroup() {
      return this.contactInfo.gid ? true : false;
    },
    isGroupDissolve() {
      return this.contactInfo.status === 'dissolve';
    }
  },
  methods: {
    activeFunc() {
      if (this.isGroup && this.isGroupDissolve) {
        return;
      }

      if (!this.isActive) {
        this.$emit('active-item', this._id);

        this.$store.commit('CURRENT_CHAT', {
          [this._idName]: this._id
        });
      }
    },

    deleteChat() {
      if (this.isActive) {
        this.$store.commit('CURRENT_CHAT', {});
      }

      this.$store.commit('DELETE_CHAT', {
        [this._idName]: this._id
      });
    }
  }
};
</script>

<style lang="stylus">
.chat-item {
  position: relative;
  display: flex;
  align-items: center;
  width: $search-bar-width;
  height: 60px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #424951;
  }

  &.active {
    background: #525C68;
  }

  .avatar {
    width: 34px;
    height: 34px;
    margin: 0 10px 0 15px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .detail {
    width: 145px;
    font-size: 12px;
    color: #CCC;
    letter-spacing: 0.09px;

    .group-dissolve {
      color: #E06C72;
    }

    .name, .last-message {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .name {
      .icon {
        margin-right: 4px;
        font-size: 10px;
      }
    }

    .last-message {
      font-size: 10px;
      color: #999999;
      letter-spacing: 0.07px;
    }
  }

  .delete-chat {
    display: none;
  }

  &:hover .delete-chat {
    display: block;
    position: absolute;
    right: 10px;
    z-index: 10;
    width: 20px;
    height: @width;
    line-height: @height;
    text-align: center;

    .icon {
      color: #CCC;
      font-size: 14px;
    }
  }
}
</style>
