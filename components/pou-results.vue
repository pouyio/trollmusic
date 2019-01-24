<template>
  <ul
    class="flex rounded p-0 bg-orange absolute flex-wrap shadow-lg overflow-y-auto justify-around"
    style="-webkit-overflow-scrolling: touch;"
    v-click-outside="hide"
  >
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
import ClickOutside from "vue-click-outside";

export default {
  name: "pou-results",
  props: ["videos", "user"],
  components: {
    pouResult
  },
  directives: {
    ClickOutside
  },
  methods: {
    add(video, title, user) {
      this.$emit("add", video, title, user);
    },
    queue(video, title, user) {
      this.$emit("queue", video, title, user);
    },
    hide() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
ul {
  --nav-height: 3.6em;
  top: var(--nav-height);
  left: 6vw;
  max-height: calc(100vh - var(--nav-height));
}
</style>
