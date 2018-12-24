<template>
  <div>
    <section v-if="videoId">
      <div class="card">
        <div class="card-header">
          
        </div>
        <div class="card-image">
          <div style="position: relative">
            <youtube
              ref="youtube"
              player-width="100%"
              :key="videoId"
              :video-id="videoId"
              :player-vars="playerVars"
              @ready="onReady"
              @ended="onEnded"
            ></youtube>
            <button class="overlay" @click="togglePlay"></button>
          </div>
        </div>
        <div class="card-content">
          <section class="level">
            <div class="" style="flex-direction: column;">
            <p class="card-header-title title is-marginless">🎥 {{ title }}</p>
            <p class="card-header-title">{{ user }}</p>
          </div>
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
    <div class="has-text-centered" v-else>
      <div class="card" style="overflow: hidden">
        <div class="card-image">
          <figure>
            <img class="w-full" src="/ben.jpg" alt="sad ben">
          </figure>
        </div>
        <div class="card-content is-paddingless">
          <h1 class="title column">
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
        rel: 0,
        playsinline: 1 
      },
      player: null,
      interval: null,
      secondsInternal: 0,
      secondsMax: 0,
      title: "",
      videoId: "",
      user: ""
    };
  },
  sockets: {
    paused(user) {
      this.pauseVideo();
      this.state = false;
    },
    playing({ video, title, user, seconds }) {
      this.state = true;
      this.videoId = video;
      this.seconds = seconds;
      this.title = title;
      this.user = user;
      this.$emit("active", true);
      // TODO refactor to avoid checking if player is available
      if (this.player) {
        this.player.seekTo(this.seconds, true);
        this.playVideo();
      }
      setTimeout(async () => {
        // TODO not working properly
        this.secondsMax = await this.player.getDuration();
      }, 700);
    }
  },
  methods: {
    playVideo() {
      clearInterval(this.interval);
      this.interval = setInterval(this.updateProgress, 1000);
      this.player.playVideo();
    },
    pauseVideo() {
      clearInterval(this.interval);
      this.player.pauseVideo();
    },
    async onReady(event) {
      this.player = event.target;
      if (this.state) {
        this.playVideo();
      } else {
        this.pauseVideo();
      }
      this.secondsMax = await this.player.getDuration();
    },
    onEnded() {
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
        this.$socket.emit("playing", {
          video: this.videoId,
          user: this.user,
          seconds: await this.player.getCurrentTime()
        });
        this.state = true;
      }
    },
    changeSeconds() {
      this.player.seekTo(this.secondsInternal, true);
      if (this.state) {
        this.$socket.emit("playing", {
          video: this.videoId,
          user: this.user,
          seconds: this.secondsInternal
        });
      } else {
        this.$socket.emit("paused", this.user);
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
