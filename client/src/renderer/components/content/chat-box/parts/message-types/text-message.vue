<template>
  <div class="text-message">
    <pre>{{ message.content.text }}</pre>
  </div>
</template>

<script>
export default {
  name: 'text-message',
  props: {
    message: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="stylus">
.text-message {
  padding: 0 2px;

  pre {
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>

