<template>
  <div class="category-item"
       @click="setCurrentCategoryId">
    <div class="category-title"
         @click="toggleContacts">

      <span v-show="!isShowContacts"
            class="icon icon-keyboard_arrow_right"></span>
      <span v-show="isShowContacts"
            class="icon icon-keyboard_arrow_down"></span>

      <span v-if="isGroupCategory">{{ $lang.contacts.category.my_groups }}</span>
      <span v-else-if="isDefaultCategory">{{ $lang.contacts.category.default_category }}</span>
      <span v-else>{{ category.alias }}</span>

    </div>

    <div v-show="isShowContacts"
         class="category-contacts">
      <contact-item v-for="item in category[ isGroupCategory ? 'groups' : 'friends' ]"
                    :key="item[_idName]"
                    :data="item"
                    :isGroup="isGroupCategory"
                    :isActive="activatedId === item[_idName] && currentCategoryId === category.cid"
                    @active-item="setActiveId"></contact-item>
    </div>
  </div>
</template>

<script>
import ContactItem from './contact-item';

export default {
  name: 'category-item',
  components: {
    ContactItem
  },
  props: {
    category: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      activatedId: null,
      isShowContacts: false
    };
  },
  computed: {
    currentCategoryId() {
      return this.$store.state.Contact.currentCategoryId;
    },
    isGroupCategory() {
      return this.category.cid === 0;
    },
    isDefaultCategory() {
      return this.category.cid === 1;
    },
    _idName() {
      return this.isGroupCategory ? 'gid' : 'uid';
    }
  },
  watch: {
    currentCategoryId() {
      if (this.currentCategoryId !== this.category.cid) {
        this.activatedId = null;
      }
    }
  },
  methods: {
    setActiveId(id) {
      this.activatedId = id;
    },
    setCurrentCategoryId() {
      this.$store.commit('SET_CURRENT_CATEGORY_ID', this.category.cid);
    },
    toggleContacts() {
      this.isShowContacts = this.isShowContacts ? false : true;
    }
  }
};
</script>

<style lang="stylus">
.category-title {
  display: flex;
  align-items: center;
  width: $search-bar-width;
  height: 30px;
  padding: 6px 15px;
  font-size: 12px;
  color: #999999;
  letter-spacing: 0.06px;
  cursor: pointer;

  &:hover {
    background: #424951;
  }

  .icon {
    margin-right: 10px;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
