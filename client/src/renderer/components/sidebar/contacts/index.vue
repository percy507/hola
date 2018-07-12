<template>
  <div id="menu-contacts">
    <category-item v-for="item in categoryArr"
                   :key="item.cid"
                   :category="item">
    </category-item>
  </div>
</template>

<script>
import CategoryItem from '../_parts/category-item';

export default {
  name: 'menu-contacts',
  components: {
    CategoryItem
  },
  data() {
    return {
      categoryArr: []
    };
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  computed: {
    currentContact() {
      return this.$store.state.Contact.currentContact;
    }
  },
  watch: {
    currentContact: {
      deep: true,
      handler() {
        this.getCategoryList();
      }
    }
  },
  methods: {
    init() {
      this.getCategoryList();
    },
    getCategoryList() {
      this.$socket.emit('get-category-list', this.$uid, data => {
        this.categoryArr = data;
      });
    }
  }
};
</script>

<style lang="stylus">
#menu-contacts {
}
</style>
