<template>
  <div class="add-new-contact">
    <div class="head">{{ contentTitle }}</div>
    <div class="search-box">
      <input type="text"
             v-model="keyword"
             placeholder="支持昵称、号码进行查找好友或群组"
             @keydown.enter="searchFunc">
      <div class="search-icon"
           @click="searchFunc">
        <span class="icon icon-search"></span>
      </div>
    </div>

    <div class="search-result">
      <div class="friend-result">
        <div class="title">{{ friendTitle }}</div>
        <div class="content">
          <search-result-item v-for="item in friendResultArr"
                              :key="item.uid"
                              :isGroup="false"
                              :data="item"></search-result-item>
        </div>
      </div>
      <div class="group-result">
        <div class="title">{{ groupTitle }}</div>
        <div class="content">
          <search-result-item v-for="item in groupResultArr"
                              :key="item.gid"
                              :isGroup="true"
                              :data="item"></search-result-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchResultItem from './parts/search-result-item';

export default {
  name: 'add-new-contact',
  components: {
    searchResultItem
  },
  data() {
    return {
      keyword: '',
      friendNum: 0,
      groupNum: 0,
      friendResultArr: [],
      groupResultArr: []
    };
  },
  computed: {
    contentTitle() {
      return this.$lang.functions.add_contact.main_title;
    },
    friendTitle() {
      return `${this.$lang.functions.add_contact.friend} [${this.friendNum}]`;
    },
    groupTitle() {
      return `${this.$lang.functions.add_contact.group} [${this.groupNum}]`;
    }
  },
  methods: {
    searchFunc() {
      if (!this.keyword) {
        return;
      }

      this.$socket.emit(
        'search-contact',
        {
          uid: this.$uid,
          keyword: this.keyword
        },
        data => {
          let friendArr = data.data.friendArr || [];
          let groupArr = data.data.groupArr || [];

          this.friendNum = friendArr.length;
          this.friendResultArr = friendArr;
          this.groupNum = groupArr.length;
          this.groupResultArr = groupArr;
        }
      );
    }
  }
};
</script>

<style lang="stylus">
.add-new-contact {
  .head {
    width: 100%;
    height: $search-bar-height;
    line-height: @height;
    padding: 0 0 0 20px;
    border-bottom: 1px solid #DDD;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0.09px;
  }

  .search-box {
    position: relative;
    display: flex;
    width: 300px;
    height: 36px;
    line-height: @height;
    margin: 30px auto;
    background: #FFFFFF;
    border: 1px solid #CCCCCC;
    border-radius: 36px;

    input {
      display: block;
      width: 264px;
      height: 34px;
      padding: 0 20px;
      border: none;
      background: none;
      font-size: 12px;
      color: #686868;

      &:focus {
        outline: none;
      }

      &::placeholder {
        font-size: 12px;
        color: #898989;
        opacity: 0.5;
      }
    }

    .search-icon {
      position: absolute;
      right: -1px;
      top: -1px;
      z-index: 3;
      width: 36px;
      height: @width;
      background: #525C68;
      border-radius: 0 50% 50% 0;
      cursor: pointer;

      .icon {
        margin-left: 8px;
        font-size: 18px;
        color: #999999;
      }
    }
  }

  .search-result {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 40px;

    &>div {
      width: 242px;
      height: 376px;
      border: 1px solid #DFDFDF;
      border-radius: 5px;

      .title {
        padding: 8px 0 10px;
        text-align: center;
        font-size: 12px;
        color: #666666;
      }

      .content {
        height: 320px;
        overflow-y: auto;
      }
    }
  }
}
</style>
