<template>
  <div class="function-item"
       :class="{ active : isActive }"
       @click="activeFunc">
    <span :class="`icon icon-${config.icon}`"></span>{{ config.title }}
  </div>
</template>

<script>
export default {
  name: 'function-item',
  props: {
    config: {
      required: true,
      type: Object,
      default: {
        icon: 'users',
        title: 'Title'
      }
    },
    isActive: {
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    activeFunc() {
      this.$emit('active-item', this.config.id);
      this.$store.commit('CURRENT_FUNCTION', this.config.flag);
    }
  }
};
</script>

<style lang="stylus">
.function-item {
  display: flex;
  align-items: center;
  width: $search-bar-width;
  height: 34px;
  font-size: 12px;
  color: #ABABAB;
  letter-spacing: 0.09px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #424951;
  }

  &.active {
    background: #525C68;
  }

  .icon {
    display: block;
    width: 12px;
    text-align: center;
    margin: 7px 10px 7px 16px;
    color: #BBBBBB;
  }
}
</style>
