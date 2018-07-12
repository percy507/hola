<template>
  <div class="system-message">
    <div class="head">{{ contentTitle }}</div>
  </div>
</template>

<script>
export default {
  name: 'system-message',
  data() {
    return {};
  },
  computed: {
    contentTitle() {
      return this.$lang.settings.system_message.main_title;
    }
  },
  methods: {
    chatFunc(e) {
      console.log(e);
    }
  }
};
</script>

<style lang="stylus">
.system-message {
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
}
</style>
