<template>
  <div>
    <div>
      <input
        v-model="searchText"
        class="transition outline-none border border-transparent bg-orange-lighter focus:border-orange-light rounded focus:bg-white hover:shadow-md py-2 pr-4 pl-4 md:pl-10 block w-full appearance-none leading-normal"
        type="text"
        placeholder="🔍 Search video..."
        @keydown.esc="reset"
      >
    </div>
    <pou-results
      v-if="results.length"
      :videos="results"
      :user="user"
      @add="add"
      @queue="queue"
      @close="reset"
    ></pou-results>
  </div>
</template>

<script>
import pouResults from "./pou-results";
import debounce from "../utils/debounce";
import { db } from "../firebase.js";

export default {
  name: "pou-search",
  props: ["user"],
  components: {
    pouResults
  },
  data: function() {
    return {
      searchText: "",
      results: []
    };
  },
  watch: {
    searchText: debounce(async function(text) {
      if (!text) {
        this.appendVideos([]);
        return;
      }
      const results = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&kind=video&key=${process.env.KEY}&q=${text}&maxResults=25`
      );
      this.appendVideos((await results.json()).items || []);
    }, 500)
  },
  created() {
    this.debounceSearchVideo = debounce(this.searchVideo, 500);
  },
  firestore() {
    return {
      videos: db.collection("videos").orderBy("order"),
      video: db.collection("video").doc("current")
    };
  },
  methods: {
    appendVideos(videos) {
      this.results = videos;
    },
    add(video, title, user) {
      this.results = [];
      this.searchText = "";
      this.$firestore.video.set({ video, title, user, playing: true });
    },
    queue(video, title, user) {
      if (this.video.video) {
        const { order = 0 } = this.videos[this.videos.length - 1] || {};
        db.collection("videos").add({ video, title, user, order: order + 1 });
      } else {
        db.collection("video")
          .doc("current")
          .set({ video, title, user, playing: true });
      }
    },
    reset() {
      this.searchText = "";
      this.results = [];
    }
  }
};
</script>
