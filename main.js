import Vue from 'vue/dist/vue.js';
import VueSocketIO from 'vue-socket.io'
import VueYoutube from 'vue-youtube'
import search from './components/search.vue';

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:8080'
}));

Vue.use(VueYoutube);

const app = new Vue({
    el: '#app',
    components: {
        search
    },
    data: {
        user: '',
        videoId: ''
    },
    sockets: {
        'video-added': function ([user, videoId]) {
            this.videoId = videoId
        }
    },
    created: function () {
        // this.user = prompt('Write your username');
        this.user = 'pollo' + new Date().getTime();
    },
    methods: {
        playing: function () {
            console.log('plating')
        }
    }
});
