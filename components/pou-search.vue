<template>
  <div>
    <div class="control" style="width: 100%">
      <input
        v-model="searchText"
        class="input is-rounded has-text-centered is-small"
        type="text"
        placeholder="🔍 Search video..."
      >
    </div>
    <pou-results v-if="results.length" :videos="results" :user="user" @add="add" @queue="queue"></pou-results>
  </div>
</template>

<script>
import pouResults from "./pou-results";
import debounce from "../utils/debounce";
const KEY = "AIzaSyARVqBg6cgDq3wsYVBqG172SMs3vZ9Yqh0";

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
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&kind=video&key=${KEY}&q=${text}&maxResults=15`
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
    add(video, title, user) {
      this.results = [];
      this.$socket.emit("add", { video, title, user });
    },
    queue(video, title, user) {
      this.results = [];
      this.$socket.emit("queue", { video, title, user });
    }
  }
};
</script>