<template>
  <div class="manage-category">
    <div class="head">{{ contentTitle }}</div>
  </div>
</template>

<script>
export default {
  name: 'manage-category',
  data() {
    return {};
  },
  computed: {
    contentTitle() {
      return this.$lang.functions.manage_category.main_title;
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
.manage-category {
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
