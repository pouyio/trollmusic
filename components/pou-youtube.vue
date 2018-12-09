<template>
  <section style="width: 640px; margin: auto;">
    <div class="card">
      <div class="card-header">
        <h1 class="is-centered card-header-title title">🎥 {{ videoId }}</h1>
      </div>
      <div class="card-image">
        <div style="position: relative">
          <youtube
            ref="youtube"
            :video-id="videoId"
            @ready="onReady"
            @playing="onPlaying"
            @ended="onEnded"
            :player-vars="playerVars"
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
</template>

<script>
import format from "format-duration";
export default {
  name: "pou-youtube",
  props: ["videoId", "seconds", "state"],
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
      isPendingToSeek: true,
      interval: null,
      secondsInternal: 0,
      secondsMax: 0
    };
  },
  methods: {
    playVideo() {
      clearInterval(this.interval);
      this.interval = setInterval(() => this.updateProgress(), 1000);
      this.player.playVideo();
    },
    pauseVideo() {
      clearInterval(this.interval);
      this.player.pauseVideo();
    },
    async onReady(event) {
      this.player = event.target;
      this.secondsMax = await this.player.getDuration();
      if (this.state) {
        this.playVideo();
      } else {
        this.pauseVideo();
      }
    },
    onPlaying() {
      if (this.state && this.isPendingToSeek) {
        this.isPendingToSeek = false;
        this.player.seekTo(this.seconds, true);
        clearInterval(this.interval);
        this.secondsInternal = this.seconds;
        this.interval = setInterval(() => this.updateProgress(), 1000);
      }
    },
    onEnded() {
      clearInterval(this.interval);
      this.$emit("ended", this.videoId);
    },
    async updateProgress() {
      this.secondsInternal = await this.player.getCurrentTime();
    },
    async togglePlay() {
      const state = await this.player.getPlayerState();
      if (state === 1) {
        this.pauseVideo();
        this.$emit("pause");
      } else {
        this.playVideo();
        this.$emit("playing", await this.player.getCurrentTime());
      }
    },
    changeSeconds() {
      this.player.seekTo(this.secondsInternal, true);
      if (this.state) {
        this.$emit("playing", this.secondsInternal);
      } else {
        this.$emit("pause");
      }
    }
  },
  watch: {
    state(val, newVal) {
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
  background:  var(--custom-color);
}

input[type="range"].slider.is-primary::-webkit-slider-runnable-track {
  background:  var(--custom-color);
}

input[type="range"].slider.is-primary::-ms-track {
  background:  var(--custom-color) !important;
}
.tag {
  background-color: var(--custom-color);
}
.card-content {
  padding: 0 1em;
}
</style>
