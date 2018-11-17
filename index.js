const debounce = (fn, time) => {
    let timeout;

    return function () {
        const functionCall = () => fn.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}

function onYouTubeIframeAPIReady() {
    // const youtube = new Youtube();
}

class Main {
    constructor() {
        this.initialize();
        this.setHandlers();
    }

    async initialize() {
        // this.user = prompt('Set your username');
        this.user = 'pollo' + new Date().getTime();
        this.searchVideoText = document.getElementById('search-video-text');
        this.results = document.getElementById('results');
        this.player = document.getElementById('player');
        this.key = 'AIzaSyARVqBg6cgDq3wsYVBqG172SMs3vZ9Yqh0';
        this.socket = io('http://localhost:8080');

        this.socket.emit('set-user', this.user, async () => {
            const users = await fetch('/users');
            console.log(await users.json())
        });
    }

    setHandlers() {
        this.searchVideoText.addEventListener('input', debounce(() => this.searchVideoButtonHandler(this.searchVideoText.value), 500));
        this.socket.on('video-added', (user, video) => this.videoAdded(user, video));
    }

    async searchVideoButtonHandler(text) {
        if (!text) {
            this.appendVideos([]);
            return;
        }
        const results = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&kind=video&key=${this.key}&q=${text}&maxResults=5`);
        this.appendVideos((await results.json()).items || [])
    }

    appendVideos(videos) {
        this.results.innerHTML = '';
        if (!videos.length) {
            return;
        }
        videos.forEach(video => {
            const li = document.createElement('li');
            li.className = 'result';
            li.appendChild(document.createTextNode(video.snippet.title));
            li.dataset.youtubeId = video.id.videoId;
            const img = document.createElement('img');
            img.setAttribute('src', video.snippet.thumbnails.default.url);
            img.setAttribute('width', '200px');
            li.appendChild(img);
            this.results.appendChild(li);
        });
        document.querySelectorAll('li.result').forEach(e => e.addEventListener('click', (e) => this.addVideoHandler(e.currentTarget.dataset.youtubeId)));
    }

    videoAdded(user, video) {
        new Youtube().play(video);
    }

    addVideoHandler(video) {
        fetch('http://localhost:8080/video', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: this.user, video })
        });
        this.results.innerHTML = '';
        this.searchVideoText.value = '';
    }

}
class Youtube {

    onPlayerReady(event) {
        event.target.playVideo();
    }

    onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(this.stopVideo, 6000);
            done = true;
        }
    }

    stopVideo() {
        this.player.stopVideo();
    }

    play(videoId) {
        this.player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId,
            events: {
                'onReady': this.onPlayerReady,
                'onStateChange': this.onPlayerStateChange
            }
        });
    }
    pause() {
        this.player.pause();
    }
}

window.onload = () => new Main();



