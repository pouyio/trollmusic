<template>
  <div>
    <div style="position: relative">
      <youtube
        v-if="videoId"
        ref="youtube"
        :video-id="videoId"
        @ready="onReady"
        @playing="onPlaying"
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
          max="100"
          v-model="percentage"
          @change="changePercentage"
        >
        <input style="width: 100%" type="range" min="0" max="100" v-model="percentageShow">
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "pou-youtube",
  props: ["videoId", "seconds", "state"],
  data() {
    return {
      percentage: 0,
      percentageShow: 0,
      playerVars: {
        controls: 1,
        disablekb: 1,
        modestbranding: 1,
        showinfo: 0,
        rel: 0
      },
      player: null,
      isPendingToSeek: true
    };
  },
  methods: {
    onReady(event) {
      this.player = event.target;
      if (this.state) {
        this.player.playVideo();
      } else {
        this.player.pauseVide();
      }
    },
    onPlaying() {
      if (this.state && this.isPendingToSeek) {
        this.isPendingToSeek = false;
        this.player.seekTo(this.seconds, true);
      }
    },
    pause() {
      this.$emit("paused");
    },
    async togglePlay() {
      const state = await this.player.getPlayerState();
      if (state === 1) {
        this.player.pauseVideo();
        this.$emit("pause");
      } else {
        this.player.playVideo();
        this.$emit("playing", await this.player.getCurrentTime());
      }
    },
    async changePercentage() {
      const duration = await this.player.getDuration();
      const secondsToSet = (+this.percentage * duration) / 100;
      this.player.seekTo(secondsToSet, true);
      if (this.state) {
        this.$emit("playing", secondsToSet);
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
        this.player.seekTo(this.seconds, true);
        this.player.playVideo();
      } else {
        this.player.pauseVideo();
      }
    },
    async seconds(seconds) {
      this.player.seekTo(seconds, true);
      if (this.state) {
        this.player.playVideo();
      } else {
        this.player.pauseVideo();
      }
    }
  }
};
</script>