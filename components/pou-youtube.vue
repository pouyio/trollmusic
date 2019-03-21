<template>
  <div class="w-full">
    <section v-if="video.video">
      <div class="relative">
        <youtube
          ref="youtube"
          player-width="100%"
          :key="video.video"
          :video-id="video.video"
          :player-vars="playerVars"
          @ready="onReady"
          @ended="onEnded"
        ></youtube>
        <button class="w-full absolute pin opacity-0 play-cursor" @click="togglePlay"></button>
      </div>

      <pou-bordered icon="🎥" :active="true" class="pt-4 m-4 md:mr-0 mt-2">
        <div class="flex items-baseline mb-2 md:flex-row flex-col justify-between">
          <h2 v-html="video.title"></h2>
          <p class="md:ml-2 text-sm text-orange md:px-2 font-light">👤 {{ video.user }}</p>
        </div>
        <div class="flex items-center">
          <input
            class="slider flex-grow"
            step="1"
            min="0"
            :max="secondsMax"
            type="range"
            v-model="secondsInternal"
            @change="changeSeconds"
          >
          <span class="ml-2">
            <span :class="{'rotating': video.playing}">⏳</span>
            {{time}} / {{timeMax}}
          </span>
        </div>
      </pou-bordered>
    </section>
    <section v-else>
      <figure>
        <img class="w-full" src="/ben.jpg" alt="sad ben">
      </figure>

      <!-- TODO fix: flex not recalculating height  -->
      <pou-bordered icon="🎥" :active="false" class="pt-4 m-4 md:mr-0 mt-2">
        <div class="flex items-baseline mb-2 md:flex-row flex-col">
          <h2 class="mx-auto">NO VIDEO YET...try searching 🔎👆🏼</h2>
        </div>
      </pou-bordered>
    </section>
  </div>
</template>

<script>
import format from "format-duration";
import pouBordered from "./pou-bordered";
import { db } from "../firebase.js";

export default {
  name: "pou-youtube",
  components: {
    pouBordered
  },
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
      secondsMax: 0
    };
  },
  firestore() {
    return {
      videos: db.collection("videos"),
      video: db.collection("video").doc("current")
    };
  },
  created() {
    db.collection("video")
      .doc("current")
      .onSnapshot(doc => {
        const { playing } = doc.data();
        if (!this.player) {
          return;
        }
        if (playing) {
          this.playVideo();
        } else {
          this.pauseVideo();
        }
      });
  },
  methods: {
    async playVideo() {
      this.player.seekTo(this.video.seconds, true);
      clearInterval(this.interval);
      this.interval = setInterval(this.updateProgress, 1000);
      this.player.playVideo();
    },
    pauseVideo() {
      clearInterval(this.interval);
      this.player.pauseVideo();
    },
    onReady(event) {
      this.player = event.target;
      if (this.video.playing) {
        this.playVideo();
      } else {
        this.pauseVideo();
      }
      this.secondsMax = this.player.getDuration();
    },
    onEnded() {
      clearInterval(this.interval);
      fetch(`./ended?id=${this.video.video}`);
    },
    updateProgress() {
      this.secondsInternal = this.player.getCurrentTime();
    },
    togglePlay() {
      const state = this.player.getPlayerState();
      const seconds = this.player.getCurrentTime();
      if (state === 1) {
        this.$firestore.video.update({ playing: false, seconds });
        this.pauseVideo();
      } else {
        this.$firestore.video.update({ playing: true });
        this.playVideo();
      }
    },
    changeSeconds() {
      this.player.seekTo(this.secondsInternal, true);
      this.$firestore.video.update({ seconds: +this.secondsInternal });
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
.play-cursor {
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='50' height='60' viewport='0 0 100 100' style='fill:black;font-size:30px;'><text y='50%'>⏯</text></svg>")
      16 0,
    auto;
}

input[type="range"].slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0.8em;
  height: 0.8rem;
  border-radius: 100%;
  background: white;
  border: 1px solid lightgray;
  cursor: pointer;
}

input[type="range"].slider::-moz-range-thumb {
  width: 0.8em;
  height: 0.8rem;
  border-radius: 100%;
  background: white;
  border: 1px solid lightgray;
  cursor: pointer;
}
.slider {
  -webkit-appearance: none;
  height: 0.43em;
  border-radius: 100px;
  background: var(--custom-color);
  outline: none;
}

.rotating {
  display: inline-block;
  animation: rotate-me 7s linear infinite;
}

@keyframes rotate-me {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
