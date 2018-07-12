import Vue from 'vue';
import Router from 'vue-router';

import Login from '../components/login.vue';
import Main from '../components/main.vue';

import MenuChats from '../components/sidebar/chats';
import MenuContacts from '../components/sidebar/contacts';
import MenuFunctions from '../components/sidebar/functions';
import MenuSettings from '../components/sidebar/settings';

import ContentChatBox from '../components/content/chat-box';
import ContentContactInfo from '../components/content/contact-info';
import ContentFunctions from '../components/content/functions';
import ContentSettings from '../components/content/settings';

import VideoChat from '../components/content/chat-box/special-pages/video-chat.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/app',
      name: 'app',
      component: Main,
      children: [
        {
          path: 'chats',
          name: 'chats',
          components: {
            menus: MenuChats,
            contents: ContentChatBox
          }
        },
        {
          path: 'contacts',
          name: 'contacts',
          components: {
            menus: MenuContacts,
            contents: ContentContactInfo
          }
        },
        {
          path: 'functions',
          name: 'functions',
          components: {
            menus: MenuFunctions,
            contents: ContentFunctions
          }
        },
        {
          path: 'settings',
          name: 'settings',
          components: {
            menus: MenuSettings,
            contents: ContentSettings
          }
        }
      ]
    },
    {
      path: '/video-chat',
      name: 'video-chat',
      component: VideoChat
    }
  ]
});
