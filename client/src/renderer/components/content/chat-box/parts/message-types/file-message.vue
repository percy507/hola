<template>
  <div class="file-message">
    {{ message.content.text }}
  </div>
</template>

<script>
export default {
  name: 'file-message',
  props: {
    message: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="stylus">
.file-message {
  padding: 0 2px;
}
</style>

