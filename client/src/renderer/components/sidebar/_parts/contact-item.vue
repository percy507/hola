<template>
  <div class="contact-item"
       :class="{ active : isActive }"
       @click="activeFunc">
    <div class="avatar">
      <img :src="data.avatar"
           alt="avatar">
    </div>

    <div v-if="isGroup"
         class="detail">
      <div class="name">
        <span class="icon icon-users"></span>{{ data.nickname }}
      </div>
    </div>

    <div v-else
         class="detail">
      <div class="name">
        {{ data.alias || data.nickname || data[_idName] }}
      </div>
      <div class="self-signature">
        {{ data.signature }}
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'contact-item',
  props: {
    data: {
      required: true,
      type: Object
    },
    isGroup: {
      required: true
    },
    isActive: {
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    _idName() {
      return this.isGroup ? 'gid' : 'uid';
    }
  },
  methods: {
    activeFunc() {
      this.$emit('active-item', this.data[this._idName]);
      this.$store.commit('CURRENT_CONTACT', {
        id: this.data[this._idName],
        isGroup: this.isGroup,
        isDefaultPage: false
      });
    }
  }
};
</script>

<style lang="stylus">
.contact-item {
  display: flex;
  align-items: center;
  width: $search-bar-width;
  height: 46px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #424951;
  }

  &.active {
    background: #525C68;
  }

  .avatar {
    width: 30px;
    height: 30px;
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

    .name, .self-signature {
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

    .self-signature {
      font-size: 10px;
      color: #999;
      letter-spacing: 0.07px;
    }
  }
}
</style>
