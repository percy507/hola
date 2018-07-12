<template>
  <keep-alive>
    <component :is="currentComponent"></component>
  </keep-alive>
</template>

<script>
import ProfileSetting from './parts/profile-setting';
import SoftwareSetting from './parts/software-setting';
import SystemMessage from './parts/system-message';

export default {
  name: 'content-settings',
  components: {
    ProfileSetting,
    SoftwareSetting,
    SystemMessage
  },
  data() {
    return {
      currentComponent: 'ProfileSetting'
    };
  },
  computed: {
    currentFunction() {
      return this.$store.state.Function.currentFunction;
    }
  },
  watch: {
    currentFunction() {
      this.currentComponent = this.currentFunction;
    }
  },
  methods: {
    //
  }
};
</script>

<style lang="stylus">
</style>
