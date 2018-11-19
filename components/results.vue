<template>
    <ul>
        <video-result
            v-for="video in videos"
            v-bind:key="video.id.videoId"
            :title="video.snippet.title"
            :img="video.snippet.thumbnails.default.url"
            :id="video.id.videoId"
            :user="user"
            @found="found"
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
    found: function() {
      this.$emit("found");
    }
  }
};
</script>