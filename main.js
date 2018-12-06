import Vue from 'vue/dist/vue.js';
import VueSocketIO from 'vue-socket.io'
import VueYouTubeEmbed from 'vue-youtube-embed'
import search from './components/search.vue';
import pouYoutube from './components/pou-youtube.vue';

Vue.use(VueYouTubeEmbed)
Vue.use(new VueSocketIO({ connection: window.location.href }));

const app = new Vue({
    el: '#app',
    components: {
        search,
        pouYoutube
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
        }
    },
    sockets: {
        paused([user]) {
            this.state = false;
        },
        playing([video, user, seconds]) {
            this.videoId = video;
            this.state = true;
            this.seconds = seconds;
        }
    },
    async created() {
        // this.user = prompt('Write your username');
        this.user = 'pollo' + new Date().getTime();

        // TODO remove this request and fetch videos on socket connection
        const videos = await (await fetch(window.location.href + "videos", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })).json();

        const firstVid = videos[0];
        if (firstVid) {
            this.videoId = firstVid.id;
            this.seconds = firstVid.seconds;
            this.state = true;
        }
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
        }
    }
});
