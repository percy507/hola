<template>
  <keep-alive>
    <component :is="currentComponent"
               :id="currentContact.id"></component>
  </keep-alive>
</template>

<script>
import DefaultPage from '../_parts/default-page';
import FriendInfo from './parts/friend-info';
import GroupInfo from './parts/group-info';

export default {
  name: 'contact-info',
  components: {
    DefaultPage,
    FriendInfo,
    GroupInfo
  },
  data() {
    return {
      currentComponent: 'DefaultPage'
    };
  },
  computed: {
    currentContact() {
      return this.$store.state.Contact.currentContact;
    }
  },
  watch: {
    currentContact() {
      if (this.currentContact.isDefaultPage) {
        this.currentComponent = 'DefaultPage';
        return;
      }

      this.currentComponent = this.currentContact.isGroup
        ? 'GroupInfo'
        : 'FriendInfo';
    }
  }
};
</script>

<style lang="stylus">
</style>
