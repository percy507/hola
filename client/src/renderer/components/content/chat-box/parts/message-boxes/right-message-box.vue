<template>
  <div class="right-message-box"
       :class="{'has-padding':isGroup}">
    <div v-if="isGroup"
         class="box-head">{{ userInfo.nickname || userInfo.uid }}</div>

    <div class="content">
      <slot></slot>
    </div>

    <div class="avatar">
      <img :src="userInfo.avatar">
    </div>
  </div>
</template>

<script>
export default {
  name: 'right-message-box',
  props: {
    message: {
      required: true,
      type: Object
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.Main.userInfo;
    },
    isGroup() {
      return this.message.to.startsWith('g');
    }
  }
};
</script>

<style lang="stylus">
.right-message-box {
  position: relative;
  display: flex;
  justify-content: flex-end;

  &.has-padding {
    padding-top: 16px;
  }

  .box-head {
    position: absolute;
    top: 0;
    z-index: 9;
    font-size: 10px;
    color: #6C7989;
  }

  .avatar {
    width: 34px;
    height: @width;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .content {
    position: relative;
    max-width: 300px;
    margin-right: 20px;
    padding: 8px;
    border-radius: 6px;
    background: $right-message-box-bg-color;
    font-size: 12px;
    color: $right-message-box-font-color;
    letter-spacing: 0.06px;
    word-break: break-all;
    cursor: text;
    user-select: text;

    &::after {
      content: '';
      position: absolute;
      top: 6px;
      right: -22px;
      z-index: 3;
      width: 0;
      height: 0;
      border-left: 12px solid $right-message-box-bg-color;
      border-right: 12px solid transparent;
      border-bottom: 12px solid transparent;
      border-top: 12px solid transparent;
    }
  }
}
</style>

