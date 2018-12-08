<template>
  <div>
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
    <div>
      <section>
        <input
          style="width: 100%"
          type="range"
          min="0"
          :max="secondsMax"
          v-model="secondsInternal"
          @change="changeSeconds"
        >
        <p style="text-align:center">{{time}}</p>
      </section>
    </div>
  </div>
</template>

<script>
import format from 'format-duration';
export default {
  name: "pou-youtube",
  props: ["videoId", "seconds", "state"],
  data() {
    return {
      playerVars: {
        controls: 1,
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
    }
  }
};
</script>