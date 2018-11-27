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
        lastUser: '',
        videoId: ''
    },
    computed: {
        player: function () {
            return this.$refs.youtube.player
        }
    },
    sockets: {
        'video-added': function ([user, videoId]) {
            this.videoId = videoId
        },
        paused: async function () {
            this.player.pauseVideo();
        },
        playing: function ([user, seconds]) {
            this.lastUser = user;

            if (this.lastUser === this.user) {
                return;
            }
            this.player.seekTo(seconds);
            this.player.playVideo();
        }
    },
    created: function () {
        this.user = prompt('Write your username');
        // this.user = 'pollo' + new Date().getTime();
    },
    methods: {
        paused: function () {
            this.$socket.emit('paused', this.user);
        },
        onPlaying: async function (e) {
            if (!this.lastUser || this.user === this.lastUser) {
                console.log(e)
                this.$socket.emit('playing', this.user, await this.player.getCurrentTime());
            }
        }
    }
});
