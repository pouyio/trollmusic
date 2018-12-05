<template>
    <div class="text-center">
        <input v-model="searchText" type="text" name="video-search" placeholder="Search video..."><br>
        <results
            v-if="results.length"
            :videos="results"
            :user="user"
            @found="found"></results>
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
        `https://www.googleapis.com/youtube/v3/search?part=snippet&kind=video&key=${KEY}&q=${text}&maxResults=5`
      );
      this.appendVideos((await results.json()).items || []);
    }, 500)
  },
  created: function() {
    this.debounceSearchVideo = debounce(this.searchVideo, 500);
  },
  methods: {
    appendVideos: function(videos) {
      this.results = videos;
    },
    found: function(video, user) {
      this.results = [];
      this.$emit("found", video, user)
    }
  }
};
</script>