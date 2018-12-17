<template>
  <div>
    <section v-if="videoId" style="width: moz-max-content;width: fit-content; margin: auto;">
      <div class="card">
        <div class="card-header">
          <!-- TODO get video title, prob a refactor needed to store it -->
          <h1 class="is-centered card-header-title title">🎥 {{ title }}</h1>
        </div>
        <div class="card-image">
          <div style="position: relative">
            <youtube
              ref="youtube"
              :video-id="videoId"
              :player-vars="playerVars"
              @ready="onReady"
              @playing="onPlaying"
              @ended="onEnded"
            ></youtube>
            <button class="overlay" @click="togglePlay"></button>
          </div>
        </div>
        <div class="card-content">
          <section class="level">
            <input
              class="slider is-fullwidth is-circle is-primary is-small"
              step="1"
              min="0"
              :max="secondsMax"
              type="range"
              v-model="secondsInternal"
              @change="changeSeconds"
            >
            <span style="margin-left: 1em;" class="tag is-rounded">⏳ {{timeMax}} / {{time}}</span>
          </section>
        </div>
      </div>
    </section>
    <div
      class="content has-text-centered"
      style="width: moz-max-content;width: fit-content; margin: auto;"
      v-else
    >
      <div class="card" style="overflow: hidden">
        <div class="image">
          <img src="/ben.jpg" alt="sad ben">
        </div>
        <div class="card-content">
          <h1 class>
            😱 NO VIDEO YET...
            <span class="is-size-4">try searching ☝️</span>
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import format from "format-duration";
export default {
  name: "pou-youtube",
  data() {
    return {
      playerVars: {
        controls: 0,
        autoplay: 1,
        disablekb: 1,
        modestbranding: 1,
        showinfo: 0,
        rel: 0
      },
      player: null,
      isFirstTime: true,
      interval: null,
      secondsInternal: 0,
      secondsMax: 0,
      title: "",
      videoId: ""
    };
  },
  sockets: {
    paused(user) {
      console.log("SOCKET - pause");
      this.pauseVideo();
      this.state = false;
    },
    playing([video, user, seconds]) {
      console.log("SOCKET - playing");
      this.state = true;
      this.videoId = video;
      this.$emit("active", true);
      this.seconds = seconds;
      this.calcTitle(this.videoId);
      if (this.player) {
        this.player.seekTo(this.seconds, true);
        this.playVideo();
      }
      // TODO force removing component from dom
      setTimeout(async () => {
        this.secondsMax = await this.player.getDuration();
      }, 700);
    }
  },
  methods: {
    playVideo() {
      console.log("playVideo");
      clearInterval(this.interval);
      this.interval = setInterval(this.updateProgress, 1000);
      this.player.playVideo();
    },
    pauseVideo() {
      clearInterval(this.interval);
      this.player.pauseVideo();
    },
    async onReady(event) {
      console.log("onReady");
      this.player = event.target;
      this.calcTitle(this.videoId);
      if (this.state) {
        this.playVideo();
      } else {
        this.pauseVideo();
      }
      this.secondsMax = await this.player.getDuration();
    },
    onPlaying() {
      console.log("onPlaying");
      if (this.state && this.isFirstTime) {
        this.isFirstTime = false;
        this.player.seekTo(this.seconds, true);
        clearInterval(this.interval);
        this.secondsInternal = this.seconds;
        this.interval = setInterval(() => this.updateProgress(), 1000);
      }
    },
    onEnded() {
      console.log("onEnded");
      clearInterval(this.interval);
      this.$socket.emit("ended", this.videoId, this.user);
      this.videoId = null;
      this.$emit("active", false);
    },
    async updateProgress() {
      this.secondsInternal = await this.player.getCurrentTime();
    },
    async togglePlay() {
      const state = await this.player.getPlayerState();
      if (state === 1) {
        this.pauseVideo();
        this.$socket.emit("paused", this.user);
        this.state = false;
      } else {
        this.playVideo();
        this.$socket.emit(
          "playing",
          this.videoId,
          this.user,
          await this.player.getCurrentTime()
        );
        this.state = true;
      }
    },
    changeSeconds() {
      this.player.seekTo(this.secondsInternal, true);
      if (this.state) {
        this.$socket.emit(
          "playing",
          this.videoId,
          this.user,
          this.secondsInternal
        );
      } else {
        this.$socket.emit("paused", this.user);
      }
    },
    // TODO REFACTOR THIS FETCH AND STORE MORE DATA
    calcTitle(id) {
      fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=AIzaSyARVqBg6cgDq3wsYVBqG172SMs3vZ9Yqh0`
      )
        .then(d => d.json())
        .then(data => {
          this.title = data.items[0].snippet.title;
        });
    }
  },
  watch: {
    state(val) {
      if (!this.player) {
        return;
      }
      if (val) {
        this.player.seekTo(this.secondsInternal, true);
        this.playVideo();
      } else {
        this.pauseVideo();
      }
    },
    async seconds(seconds) {
      if (!this.player) {
        return;
      }
      this.player.seekTo(seconds, true);
      if (this.state) {
        this.playVideo();
      } else {
        this.pauseVideo();
      }
    }
  },
  computed: {
    time() {
      return format(this.secondsInternal * 1000);
    },
    timeMax() {
      return format(this.secondsMax * 1000);
    }
  }
};
</script>

<style scoped>
.overlay {
  position: absolute;
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='50' height='60' viewport='0 0 100 100' style='fill:black;font-size:30px;'><text y='50%'>⏯</text></svg>")
      16 0,
    auto;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
}
input[type="range"].slider.is-primary::-moz-range-track {
  background: var(--custom-color);
}

input[type="range"].slider.is-primary::-webkit-slider-runnable-track {
  background: var(--custom-color);
}

input[type="range"].slider.is-primary::-ms-track {
  background: var(--custom-color) !important;
}
.tag {
  background-color: var(--custom-color);
}
.card-content {
  padding: 0 1em;
}
</style>
