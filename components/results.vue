<template>
  <ul style="padding: 0; margin: 0; position: absolute; top: 0; right: 0; left: 0; z-index: 1">
    <video-result
      v-for="video in videos"
      :key="video.id.videoId"
      :title="video.snippet.title"
      :img="video.snippet.thumbnails.default.url"
      :id="video.id.videoId"
      :user="user"
      @found="found"
      @queue="queue"
    ></video-result>
  </ul>
</template>

<script>
import videoResult from "./video-result.vue";
export default {
  name: "results",
  props: ["videos", "user"],
  components: {
    videoResult
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