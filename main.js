import Vue from 'vue/dist/vue.js';
import VueSocketIO from 'vue-socket.io'
import VueYouTubeEmbed from 'vue-youtube-embed'
import search from './components/search.vue';
import pouYoutube from './components/pou-youtube.vue';
import pouList from './components/pou-list.vue';

Vue.use(VueYouTubeEmbed)
Vue.use(new VueSocketIO({ connection: window.location.href }));

const app = new Vue({
    el: '#app',
    components: {
        search,
        pouYoutube,
        pouList
    },
    data: {
        videoId: '',
        seconds: 0,
        state: 0,
        user: '',
        percentage: 0,
        percentageShow: 0,
        playerVars: {
            controls: 1,
            disablekb: 1,
            modestbranding: 1,
            showinfo: 0,
            rel: 0
        },
        list: []
    },
    sockets: {
        paused([user]) {
            this.state = false;
        },
        playing([video, user, seconds]) {
            this.state = true;
            this.seconds = seconds;
            this.videoId = video;
        },
        queue([user, list]) {
            this.list = list;
        }
    },
    created() {
        // this.user = prompt('Write your username');
        this.user = 'pollo' + new Date().getTime();
    },
    methods: {
        pause() {
            this.state = false;
            this.$socket.emit('paused', this.user);
        },
        playing(seconds) {
            this.state = true;
            this.seconds = seconds;
            this.$socket.emit('playing', this.videoId, this.user, seconds);
        },
        add(video, user) {
            this.$socket.emit('add', video, user);
        },
        queue(video, user) {
            this.$socket.emit('queue', video, user);
        },
        reset() {
            this.$socket.emit('reset', this.user);
        },
        ended(video) {
            this.videoId = null;
            this.$socket.emit('ended', video);
        }
    }
});
