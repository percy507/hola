<template>
  <div class="create-group">
    <div class="head">{{ contentTitle }}</div>

    <div class="form">
      <div class="form-item form-item-avatar">
        <div class="img">
          <label for="avatar-input"><img :src="avatar"></label>
        </div>
        <div class="input">
          <input id="avatar-input"
                 ref="avatarInput"
                 type="file"
                 accept="image/*">
        </div>
      </div>

      <div class="form-item form-item-input">
        <input type="text"
               v-model="nickname"
               placeholder="请输入群组名称"
               required>
      </div>

      <div class="form-item form-item-button">
        <button @click="createGroup">创建群组</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'create-group',
  data() {
    return {
      nickname: '',
      avatar: 'http://localhost:3000/upload/default/default-group-avatar.png'
    };
  },
  computed: {
    contentTitle() {
      return this.$lang.functions.create_group.main_title;
    }
  },
  methods: {
    createGroup() {
      if (!this.nickname) {
        alert('群组名称不得为空');
        return;
      }
      this.$socket.emit(
        'create-group',
        {
          uid: this.$uid,
          groupInfo: {
            // avatar: '',
            nickname: this.nickname,
            members: [
              {
                uid: this.$uid,
                flag: '群主'
              }
            ]
          }
        },
        data => {
          alert(data.message);
        }
      );
    }
  }
};
</script>

<style lang="stylus">
.create-group {
  .head {
    width: 100%;
    height: $search-bar-height;
    line-height: @height;
    padding: 0 0 0 20px;
    border-bottom: 1px solid #DDD;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0.09px;
  }

  .form-item {
    display: flex;
    justify-content: center;
    padding-top: 30px;
  }

  .form-item-avatar {
    display: block;
    margin: 0 auto;
    width: 100px;

    .img {
      width: 100px;
      height: 100px;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .input {
      input[type=file] {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
      }
    }
  }

  .form-item-input {
    input {
      padding: 4px 8px;

      &:focus {
        outline: none;
      }
    }
  }

  .form-item-button {
    button {
      width: 100px;
      height: 26px;
      line-height: @height;
      border: none;
      border-radius: 4px;
      background: #696969;
      color: #FFF;
    }
  }
}
</style>
