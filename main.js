import Vue from 'vue/dist/vue.js';
import VueSocketIO from 'vue-socket.io'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueChatScroll from 'vue-chat-scroll'
import VueNativeNotification from 'vue-native-notification'
import VueRouter from 'vue-router';
import PouLog from './components/pou-log.vue';
import './style.css'

import App from './App.vue';

Vue.use(VueYouTubeEmbed)
Vue.use(new VueSocketIO({ debug: true, connection: window.location.href }));
Vue.use(VueNativeNotification, { requestOnNotify: true });
Vue.use(VueChatScroll)

const routes = [
    { path: '/', component: App },
    { path: '/log', component: PouLog }
];
const router = new VueRouter({ routes });
Vue.use(VueRouter)

new Vue({
    router,
    el: "#app"
});