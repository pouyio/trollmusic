<template>
  <ul class="is-flex">
    <pou-result
      v-for="video in videos"
      :key="video.id.videoId"
      :title="video.snippet.title"
      :img="video.snippet.thumbnails.default.url"
      :id="video.id.videoId"
      :user="user"
      @add="add"
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
    add(video, title, user) {
      this.$emit("add", video, title, user);
    },
    queue(video, title, user) {
      this.$emit("queue", video, title, user);
    }
  }
};
</script>

<style scoped>
ul {
  --nav-height: 2.7em;
  position: absolute;
  top: var(--nav-height);
  width: 84vw;
  left: 6vw;
  max-height: calc(100vh - var(--nav-height));
  overflow-y: auto;
  flex-wrap: wrap;
  background-color: var(--custom-color);
  justify-content: space-evenly;
  align-items: flex-end;
}
</style>
