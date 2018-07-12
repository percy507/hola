<template>
  <div id="login">
    <div class="logo-title">Hola!</div>
    <div class="logo-img">
      <img src="../assets/logo.png"
           alt="logo">
    </div>
    <div class="logo-form">
      <div class="logo-form-item">
        <span class="icon-user"></span>
        <input type="text"
               class="input-phone"
               maxlength="11"
               autocomplete="off"
               autofocus
               :placeholder="$lang.login.phone_hint"
               v-model="phone"
               @input="onlyNumber('phone')" />
      </div>

      <div class="logo-form-item">
        <span class="icon-key"></span>
        <input type="text"
               class="input-authcode"
               maxlength="6"
               autocomplete="off"
               :placeholder="$lang.login.authcode_hint"
               v-model="authcode"
               @input="onlyNumber('authcode')"
               @keydown.enter="loginFunc" />
        <button class="btn-get-authcode"
                :class="isAlreadyGetAuthcode ? 'disabled' : 'not-disabled'">
          <span v-if="!isAlreadyGetAuthcode"
                @click="getAuthcode">{{ $lang.login.authcode_button }}</span>
          <span v-if="isAlreadyGetAuthcode">{{ countDownTime }} s</span>
        </button>
      </div>

      <div class="logo-form-item">
        <button class="btn-submit"
                :class="isFormFinished ? 'not-disabled' : 'disabled'"
                @click="loginFunc">{{$lang.login.submit_button}}</button>
      </div>
    </div>
  </div>
</template>

<script>
const COUNT_TIME = 60;

export default {
  name: 'login',
  data() {
    return {
      phone: '',
      authcode: '',

      isAlreadyGetAuthcode: false,

      countDownTime: COUNT_TIME
    };
  },
  computed: {
    isFormFinished() {
      return this.phone.length === 11 && this.authcode.length === 6;
    }
  },
  created() {
    let isAllowLogin = this.$electron.remote.getGlobal('isAllowLogin');

    // if allow login , go to home page
    if (isAllowLogin) {
      this.$router.push({
        path: '/app/chats'
      });
    }
  },
  methods: {
    onlyNumber(value) {
      this[value] = this[value].replace(/[^\d]/g, '');
    },

    // count down
    startCountDown() {
      let timer = setInterval(() => {
        this.countDownTime--;

        if (this.countDownTime === 0) {
          clearInterval(timer);

          this.isAlreadyGetAuthcode = false;
          this.countDownTime = COUNT_TIME;
        }
      }, 1000);
    },

    // check the validity of phone number
    isPhoneNumberValid() {
      // match Chinese phone number
      let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

      if (!reg.test(this.phone)) {
        this.$electron.ipcRenderer.send('show-error-dialog', {
          title: this.$lang.login.error.title,
          content: this.$lang.login.error.phone_error
        });

        return false;
      }

      return true;
    },

    getAuthcode() {
      if (this.isPhoneNumberValid()) {
        this.isAlreadyGetAuthcode = true;

        this.startCountDown();
        this.requestAuthcode();
      }
    },

    requestAuthcode() {
      this.$socket.emit('get-authcode', this.phone, data => {
        console.log(data.authcode);
      });
    },

    loginFunc() {
      if (this.isPhoneNumberValid()) {
        this.requestLogin();
      }
    },

    requestLogin() {
      this.$socket.emit(
        'login',
        {
          phone: this.phone,
          authcode: this.authcode
        },
        data => {
          if (data.isAllowLogin) {
            // reset this.$uid to actual uid
            Object.getPrototypeOf(this).$uid = data.uid;

            this.$electron.ipcRenderer.send('save-user-data', {
              uid: data.uid,
              lang: this.$electronStore.get('lang') || 'zh-CN'
            });

            this.$electron.ipcRenderer.send('login');
          } else {
            this.$electron.ipcRenderer.send('show-error-dialog', {
              title: this.$lang.login.error.title,
              content: this.$lang.login.error.login_error
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="stylus">
#login {
  width: 100vw;
  height: 100vh;
  background: #393F46;
}

.logo-title {
  padding: 35px 0 0 30px;
  font-family: 'local-Flavors';
  font-size: 36px;
  color: #BBB;
  letter-spacing: 0.07px;
}

.logo-img {
  padding: 15px 75px 35px;
  text-align: center;

  img {
    width: 130px;
    height: 90px;
  }
}

.logo-form {
}

.logo-form-item {
  display: flex;
  width: 200px;
  margin: auto;
  padding: 6px 0 3px;
  border-bottom: 1px solid #666;

  &:last-child {
    margin-top: 5px;
    border-bottom: none;
  }

  $item-height = 26px;

  .icon-user, .icon-key {
    display: block;
    margin-right: 10px;
    height: $item-height;
    line-height: @height;
    text-align: center;
    color: #BBB;
    font-size: 18px;

    &::before {
      display: block;
      width: 16px;
      height: 16px;
    }
  }

  .icon-key {
    font-size: 16px;
  }

  input {
    display: block;
    height: $item-height;
    border: none;
    background: none;
    font-size: 14px;
    color: #9A9A9A;
    caret-color: #898989;
    letter-spacing: 0.6px;

    &:hover {
      border: none;
      outline: none;
    }

    &:focus {
      outline: none;
    }

    &::-webkit-input-placeholder {
      font-size: 12px;
      color: #787878;
      letter-spacing: 0.2px;
    }
  }

  .input-authcode {
    width: 94px;
  }

  .btn-get-authcode, .btn-submit {
    display: block;
    height: 26px;
    border: none;
    font-size: 12px;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  .btn-get-authcode {
    width: 80px;
    flex-shrink: 0;
    border-radius: 4px;
  }

  .btn-submit {
    width: 100%;
    border-radius: 4px;
  }

  .disabled {
    color: #898989;
    background: #4C4E52;
    pointer-events: none;
  }

  .not-disabled {
    color: #AAA;
    background: #585B5F;
  }
}
</style>