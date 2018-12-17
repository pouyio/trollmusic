<template>
  <ul class="is-flex">
    <pou-result
      v-for="video in videos"
      :key="video.id.videoId"
      :title="video.snippet.title"
      :img="video.snippet.thumbnails.default.url"
      :id="video.id.videoId"
      :user="user"
      @found="found"
      @queue="queue"
    ></pou-result>
  </ul>
</template>

<script>
import pouResult from "./pou-result.vue";
export default {
  name: "pou-results",
  props: ["videos", "user"],
  components: {
    pouResult
  },
  methods: {
    found(video, user) {
      this.$emit("found", video, user);
    },
    queue(video, user) {
      this.$emit("queue", video, user);
    }
  }
};
</script>

<style scoped>
ul {
  --nav-height: 4.2em;
  position: absolute;
  top: 4.2em;
  width: 84vw;
  left: 6vw;
  max-height: calc(100vh - 4.2em);
  overflow-y: auto;
  flex-wrap: wrap;
  background-color: var(--custom-color);
  justify-content: space-evenly;
  align-items: flex-end;
}
</style>
