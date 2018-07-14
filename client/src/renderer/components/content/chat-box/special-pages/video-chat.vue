<template>
  <div class="video-chat">
    <div class="local-video-container"
         :class="{'remote-video-loaded':isRemoteVideoLoaded}">
      <video class="local-video"
             ref="local-video"
             autoplay></video>
    </div>

    <div class="remote-video-container"
         :class="{'remote-video-loaded':isRemoteVideoLoaded}">
      <video class="remote-video"
             ref="remote-video"
             autoplay></video>
    </div>

    <div class="video-tools">
      <div class="hang-up"
           @click.stop="hangUpFunc">
        <span class="icon icon-phone-hang-up"></span>
      </div>
    </div>
  </div>
</template>

<script>
// adapter.js is a shim of WebRTC to insulate apps from spec changes and prefix differences
// https://github.com/webrtc/adapter
import 'webrtc-adapter';

export default {
  name: 'video-chat',
  data() {
    return {
      isRemoteVideoLoaded: false,
      localStream: null,
      remoteStream: null,
      pc: null
    };
  },
  computed: {
    toUid() {
      return this.$route.query.to;
    },
    type() {
      // call or pickUp   打电话或接电话
      return this.$route.query.type;
    }
  },
  watch: {
    localStream() {
      this.$refs['local-video'].srcObject = this.localStream;
    },
    remoteStream() {
      this.$refs['remote-video'].srcObject = this.remoteStream;
    }
  },
  mounted() {
    this.loadLocalVideo().then(() => {
      this.initConnect();

      if (this.type === 'call') {
        this.$socket.emit('request-video-chat', {
          from: this.$uid,
          to: this.toUid
        });

        this.$socket.on('video-chat-ready', () => {
          this.createOffer();
        });
      } else if (this.type === 'pickUp') {
        this.createAnswer();

        this.$socket.emit('video-chat-ready', {
          from: this.$uid,
          to: this.toUid
        });
      } else {
        alert('Unknown error');
      }
    });
  },
  methods: {
    loadLocalVideo() {
      return new Promise((resolve, reject) => {
        let constraints = {
          audio: true,
          video: {
            width: 1200,
            height: 720
          }
        };

        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(mediaStream => {
            this.localStream = mediaStream;
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject(new Error(err));
          });
      });
    },
    initConnect() {
      let rtcConfig = {
        // use free stun server
        iceServers: [
          { urls: 'stun:stun.voxgratia.org' },
          { urls: 'stun:stun.voipstunt.com' },
          { urls: 'stun:stunserver.org' },
          { urls: 'stun:stun.ekiga.net' }
        ]
      };
      let pc = null;

      pc = new RTCPeerConnection(rtcConfig);

      this.pc = pc;

      this.$socket.on('rtc-candidate', ({ candidateSdp }) => {
        let candidate = new RTCIceCandidate({
          candidate: candidateSdp
        });

        pc
          .addIceCandidate(candidate)
          .then(() => {
            console.log('pc addIceCandidate success');
          })
          .catch(() => {
            console.error('pc addIceCandidate failed');
          });
      });

      pc.onicecandidate = event => {
        console.log('candidate: ', event);

        if (event.candidate) {
          let candidateSdp = event.candidate.candidate;

          this.$socket.emit('rtc-candidate', {
            from: this.$uid,
            to: this.toUid,
            candidateSdp
          });
        }
      };

      pc.oniceconnectionstatechange = event => {
        console.log(`ICE state: ${pc.iceConnectionState}`);
        console.log('ICE state change event: ', event);
      };

      pc.ontrack = event => {
        console.log('%c pc.ontrack', 'color:#41C02D');
        console.log(event);

        if (this.remoteStream !== event.streams[0]) {
          this.remoteStream = event.streams[0];
          this.isRemoteVideoLoaded = true;
          console.log('%c received remote stream', 'color:#41C02D');
        }
      };

      console.log('add local tracks to pc');

      this.localStream.getTracks().forEach(track => {
        // note: chrome  not support addTrack method now, so we use a shim
        // https://github.com/webrtc/adapter
        pc.addTrack(track, this.localStream);
      });
    },
    createOffer() {
      let pc = this.pc;
      let offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      };

      if (!pc) {
        return;
      }

      pc
        .createOffer(offerOptions)
        .then(offer => {
          console.log('\ncreateoffer -> offer:');
          console.log(offer);
          console.log('\n');
          console.log('pc start setLocalDescription');

          pc
            .setLocalDescription(offer)
            .then(() => {
              console.log('pc setLocalDescription complete');

              // send offer to remote client
              this.$socket.emit('rtc-offer', {
                from: this.$uid,
                to: this.toUid,
                offerSdp: offer.sdp
              });
            })
            .catch(err => {
              console.log(`pc setLocalDescription failed：${err.toString()}`);
            });
        })
        .catch(err => {
          console.error(`pc createOffer fail：${err.toString()}`);
        });

      this.$socket.on('rtc-answer', ({ answerSdp }) => {
        let answer = new RTCSessionDescription({
          type: 'answer',
          sdp: answerSdp
        });

        console.log('pc start setRemoteDescription');
        console.log(answer);

        pc
          .setRemoteDescription(answer)
          .then(() => {
            console.log('pc setRemoteDescription complete');
          })
          .catch(err => {
            console.log(`pc setRemoteDescription failed：${err.toString()}`);
          });
      });
    },
    createAnswer() {
      let pc = this.pc;

      this.$socket.on('rtc-offer', ({ offerSdp }) => {
        let offer = new RTCSessionDescription({
          type: 'offer',
          sdp: offerSdp
        });

        console.log('pc start setRemoteDescription');
        console.log(offer);

        pc
          .setRemoteDescription(offer)
          .then(() => {
            console.log('pc setRemoteDescription complete');
          })
          .catch(err => {
            console.log(`pc setRemoteDescription failed：${err.toString()}`);
          });

        console.log('pc start createAnswer');

        pc
          .createAnswer()
          .then(answer => {
            console.log('\ncreateAnswer -> answer:');
            console.log(answer);
            console.log('\n');
            console.log('pc start setLocalDescription');

            pc
              .setLocalDescription(answer)
              .then(() => {
                console.log('pc setLocalDescription complete');

                // send answer to remote client
                this.$socket.emit('rtc-answer', {
                  from: this.$uid,
                  to: this.toUid,
                  answerSdp: answer.sdp
                });
              })
              .catch(err => {
                console.log(`pc setLocalDescription failed：${err.toString()}`);
              });
          })
          .catch(err => {
            console.error(`pc createAnswer fail：${err.toString()}`);
          });
      });
    },
    hangUpFunc() {
      let win = this.$electron.remote.getCurrentWindow();

      this.pc.close();
      win.close();
    }
  }
};
</script>

<style lang="stylus" scoped>
html, body {
  height: 100%;
}

.video-chat {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &:hover .video-tools {
    opacity: 1;
    pointer-events: auto;
  }
}

.local-video-container, .remote-video-container {
  width: 100%;
  height: 100%;
}

.local-video, .remote-video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.local-video-container {
  &.remote-video-loaded {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 20%;
    height: auto;
    border: 1px solid #FFF;
    border-radius: 2px;
  }
}

.remote-video-container {
  display: none;

  &.remote-video-loaded {
    display: block;
  }
}

.video-tools {
  display: flex;
  position: absolute;
  bottom: 14px;
  right: 20px;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: 0.4s;

  .hang-up {
    width: 36px;
    height: @width;
    line-height: @height;
    border-radius: 50%;
    background: #E5664E;
    text-align: center;
    cursor: pointer;

    .icon {
      font-size: 16px;
      color: #FFF;
    }
  }
}
</style>
