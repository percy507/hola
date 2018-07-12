<template>
  <div class="search-result-item">
    <div class="avatar">
      <img :src="data.avatar"
           alt="avatar">
    </div>
    <div class="name">{{ data.nickname || data.uid }}</div>
    <div class="icon"
         @click="addContactRequest">
      <span :class="iconStatus"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search-result-item',
  props: {
    data: {
      required: true,
      type: Object
    },
    isGroup: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      iconStatus: 'icon-add'
    };
  },
  methods: {
    addContactRequest() {
      if (this.iconStatus === 'icon-check') {
        return;
      }

      const event = this.isGroup ? 'join-group' : 'add-friend';
      const prop = this.isGroup ? 'gid' : 'friendUid';

      let obj = {
        uid: this.$uid,
        [prop]: this.isGroup ? this.data.gid : this.data.uid
      };

      this.$socket.emit(event, obj, data => {
        if (data.code === 0) {
          this.iconStatus = 'icon-check';
          alert(data.message);
        }
      });
    }
  }
};
</script>


<style lang="stylus">
.search-result-item {
  display: flex;
  align-items: center;
  width: 220px;
  height: 36px;
  margin: 0 auto 10px;
  background: #FFF;
  border-radius: 4px;

  .avatar {
    width: 26px;
    height: 26px;
    margin: 0 8px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .name {
    width: 140px;
    font-size: 10px;
    color: #676767;
    letter-spacing: 0.14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon {
    width: 14px;
    height: @width;
    margin: 0 8px 0 16px;
    line-height: @height;
    text-align: center;
    font-size: 14px;
    color: #A7B0BB;
    cursor: pointer;

    &:hover {
      color: #666;
    }
  }

  .icon-check {
    color: #424951;
    cursor: text;
  }
}
</style>
