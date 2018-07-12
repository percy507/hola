<template>
  <div class="image-message">
    <img :src="src"
         :class="{ 'image-unload': !isImageLoad }">
    <div v-if="!isImageLoad"
         class="image-loading">
      <div class="ball-triangle-path">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'image-message',
  props: {
    message: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      isImageLoad: false,
      src: ''
    };
  },
  created() {
    this.loadImage();
  },
  methods: {
    loadImage() {
      const img = new Image();
      const src = this.message.content.url;

      img.onload = () => {
        // TODO 本地测试，为了展示加载中效果
        setTimeout(() => {
          this.isImageLoad = true;
          this.src = src;
        }, 1200);
      };

      img.src = src;
    }
  }
};
</script>

<style lang="stylus">
.image-message {
  position: relative;
  cursor: default;

  img {
    display: block;
    max-width: 200px;
    max-height: 200px;
    border-radius: 4px;
  }

  .image-unload {
    width: 200px;
    height: 200px;
    opacity: 0;
  }

  .image-loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
  }
}

@keyframes ball-triangle-path-1 {
  33% {
    transform: translate(25px, -50px);
  }

  66% {
    transform: translate(50px, 0px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes ball-triangle-path-2 {
  33% {
    transform: translate(25px, 50px);
  }

  66% {
    transform: translate(-25px, 50px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes ball-triangle-path-3 {
  33% {
    transform: translate(-50px, 0px);
  }

  66% {
    transform: translate(-25px, -50px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.ball-triangle-path {
  position: relative;
  transform: translate(-29.994px, -37.50938px);
}

.ball-triangle-path > div:nth-child(1) {
  animation-name: ball-triangle-path-1;
  animation-delay: 0;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.ball-triangle-path > div:nth-child(2) {
  animation-name: ball-triangle-path-2;
  animation-delay: 0;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.ball-triangle-path > div:nth-child(3) {
  animation-name: ball-triangle-path-3;
  animation-delay: 0;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.ball-triangle-path > div {
  animation-fill-mode: both;
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  border: 1px solid #FFF;
}

.ball-triangle-path > div:nth-of-type(1) {
  top: 50px;
}

.ball-triangle-path > div:nth-of-type(2) {
  left: 25px;
}

.ball-triangle-path > div:nth-of-type(3) {
  top: 50px;
  left: 50px;
}
</style>

