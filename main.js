import Vue from 'vue/dist/vue.js';
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueChatScroll from 'vue-chat-scroll'
import VueNativeNotification from 'vue-native-notification'
import './style.css'

import App from './App.vue';

Vue.use(VueYouTubeEmbed)
Vue.use(VueNativeNotification, { requestOnNotify: true });
Vue.use(VueChatScroll)

new Vue({
    el: "#app",
    template: '<App/>',
    components: { App }
});