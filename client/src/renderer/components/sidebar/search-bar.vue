<template>
  <div id="search-bar">
    <div class="content">
      <input type="text"
             v-model="keyword"
             :placeholder="placeholder"
             @focus="removePlaceholder"
             @blur="setPlaceholder"
             @keydown.enter="searchFunc">
    </div>
  </div>
</template>

<script>
export default {
  name: 'search-bar',
  data() {
    return {
      keyword: '',
      placeholder: ''
    };
  },
  created() {
    this.setPlaceholder();
  },
  methods: {
    removePlaceholder() {
      this.placeholder = '';
    },
    setPlaceholder() {
      this.placeholder = this.$lang.sidebar.search;
    },
    searchFunc() {
      console.log('searching...');
    }
  }
};
</script>

<style lang="stylus">
#search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: $search-bar-width;
  height: $search-bar-height;
  background: $search-bar-bg;

  .content {
    width: 190px;
    height: 26px;
    background: #485057;
    border-radius: 100px;
  }

  input {
    display: block;
    width: 100%;
    height: 26px;
    padding: 0 15px;
    border: none;
    background: none;
    font-size: 12px;
    color: #aaa;
    text-align: center;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #797979;
      letter-spacing: 0.1px;
      font-family: 'icomoon';
      font-weight: 400;
    }
  }
}
</style>
