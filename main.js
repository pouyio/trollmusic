import Vue from 'vue/dist/vue.js';
import VueYouTubeEmbed from 'vue-youtube-embed';
import VueChatScroll from 'vue-chat-scroll';
import VueNativeNotification from 'vue-native-notification';
import VueFirestore from 'vue-firestore';
import VueSanitize from 'vue-sanitize';
import './tailwind.css'

import App from './App.vue';

Vue.use(VueFirestore);
Vue.use(VueYouTubeEmbed);
Vue.use(VueNativeNotification, { requestOnNotify: true });
Vue.use(VueChatScroll);
Vue.use(VueSanitize, {
    allowedTags: ['a'],
    allowedAttributes: {
        'a': ['href', 'target']
    }
});

new Vue({
    el: "#app",
    template: '<App/>',
    components: { App }
});