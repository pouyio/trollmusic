import Vue from 'vue/dist/vue.js';
import VueSocketIO from 'vue-socket.io'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueChatScroll from 'vue-chat-scroll'
// import 'bulma/css/bulma.min.css'
// import 'bulma-slider/dist/css/bulma-slider.min.css'
import './style.css'

import App from './App.vue';

Vue.use(VueYouTubeEmbed)
Vue.use(new VueSocketIO({ connection: window.location.href }));
Vue.use(VueChatScroll)

new Vue({
    el: "#app",
    template: '<App/>',
    components: { App }
});