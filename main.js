import Vue from 'vue/dist/vue.js';
import VueSocketIO from 'vue-socket.io'
import VueYoutube from 'vue-youtube'

const debounce = (fn, time) => {
    let timeout;

    return function () {
        const functionCall = () => fn.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}

Vue.component('video-result', {
    props: ['title', 'img', 'id'],
    data: () => ({
        styleObj: {
            height: '180px',
            width: '320px',
            margin: 'auto'
        }
    }),
    template: `
    <div @click="addVideo()" v-bind:style="styles"> 
        <p style="background-color: white">
            {{ title }} 
        </p>
    </div>
    `,
    computed: {
        styles: function () {
            return {
                ...this.styleObj,
                background: 'url(' + this.img + ') top left / cover no-repeat'
            }
        }
    },
    methods: {
        addVideo: function () {
            this.$emit('found');
            fetch('http://localhost:8080/video', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: app.user, video: this.id })
            });
        }
    }
})

Vue.component('results', {
    props: ['videos'],
    template: `<ul>
        <video-result
            v-for="video in videos"
            v-bind:key="video.id.videoId"
            :title="video.snippet.title"
            :img="video.snippet.thumbnails.default.url"
            :id="video.id.videoId"
            @found="found"
        ></video-result>
    </ul>
    `,
    methods: {
        found: function () {
            this.$emit('found');
        }
    }
})

Vue.component('search', {
    data: function () {
        return {
            searchText: '',
            results: []
        }
    },
    template: `<div class="text-center">
                <input v-model="searchText" type="text" name="video-search" placeholder="Search video..."><br>
                <results
                    v-if="results.length"
                    :videos="results"
                    @found="found"></results>
            </div>`,
    watch: {
        searchText: function (newSearchText) {
            this.debounceSearchVideo(newSearchText);
        }
    },
    created: function () {
        this.debounceSearchVideo = debounce(this.searchVideo, 500);
    },
    methods: {
        searchVideo: async function (text) {
            if (!text) {
                this.appendVideos([]);
                return;
            }
            const results = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&kind=video&key=${KEY}&q=${text}&maxResults=5`);
            this.appendVideos((await results.json()).items || [])
        },
        appendVideos: function (videos) {
            this.results = videos;
        },
        found: function () {
            this.results = [];
        }
    }
});

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:8080'
}));

Vue.use(VueYoutube);

const app = new Vue({
    el: '#app',
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



