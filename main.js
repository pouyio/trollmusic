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
        },
        paused: function() {
            this.$refs.youtube.player.pauseVideo();
        },
        playing: function() {
            this.$refs.youtube.player.playVideo();
        }
    },
    created: function () {
        // this.user = prompt('Write your username');
        this.user = 'pollo' + new Date().getTime();
    },
    methods: {
        paused: function () {
            this.$socket.emit('paused', this.user);
        },
        playing: function () {
            this.$socket.emit('playing', this.user);
        }
    }
});
