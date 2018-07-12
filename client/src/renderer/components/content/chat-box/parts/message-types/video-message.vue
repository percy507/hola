<template>
  <div class="video-message">
    {{ message.content.text }}
  </div>
</template>

<script>
export default {
  name: 'video-message',
  props: {
    message: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="stylus">
.video-message {
  padding: 0 2px;
}
</style>

