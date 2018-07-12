<template>
  <div class="system-message">
    {{ message.content.text }}
  </div>
</template>

<script>
export default {
  name: 'system-message',
  props: {
    message: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="stylus">
.system-message {
  padding: 0 2px;
}
</style>

