<template>
  <div class="default-page">
    <img src="../../../assets/logo.png"
         alt="Logo">
  </div>
</template>

<script>
export default {
  name: 'default-page',
  data() {
    return {};
  },
  methods: {
    chatFunc(e) {
      console.log(e);
    }
  }
};
</script>

<style lang="stylus">
.default-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: $app-height;

  img {
    width: 247px;
    height: 170px;
    opacity: 0.4;
  }
}
</style>
