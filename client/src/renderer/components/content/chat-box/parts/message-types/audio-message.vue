<template>
  <div class="audio-message">
    {{ message.content.text }}
  </div>
</template>

<script>
export default {
  name: 'audio-message',
  props: {
    message: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="stylus">
.audio-message {
  padding: 0 2px;
}
</style>

