<template>
  <div class="control has-icons-left">
    <input
      v-model="searchText"
      class="input is-rounded has-icons-left"
      type="text"
      placeholder="Search video..."
    >
    <span class="icon">🔍</span>
    <div style="position: relative;">
      <results v-if="results.length" :videos="results" :user="user" @found="found" @queue="queue"></results>
    </div>
  </div>
</template>

<script>
import results from "./results";
import debounce from "../utils/debounce";
const KEY = "AIzaSyARVqBg6cgDq3wsYVBqG172SMs3vZ9Yqh0";

export default {
  name: "search",
  props: ["user"],
  components: {
    results
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
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&kind=video&key=${KEY}&q=${text}&maxResults=5`
      );
      this.appendVideos((await results.json()).items || []);
    }, 500)
  },
  created() {
    this.debounceSearchVideo = debounce(this.searchVideo, 500);
  },
  methods: {
    appendVideos(videos) {
      this.results = videos;
    },
    found(video, user) {
      this.results = [];
      this.$emit("found", video, user);
    },
    queue(video, user) {
      this.results = [];
      this.$emit("queue", video, user);
    }
  }
};
</script>