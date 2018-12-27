<template>
  <div class="pt-2">
    <pou-bordered :icon="'🔜'" :active="list.length" class="p-4">
      <div class="flex flex-wrap justify-around md:justify-start" v-if="list.length">
        <div
          v-for="(video, index) in list"
          :key="video.video"
          class="w-32 md:w-48 md:m-2 m-1 border rounded md:flex-initial flex-grow relative"
          :style="{opacity: 1 / (index + 1) }"
        >
          <div class="overflow-hidden">
            <button
              @click="remove(video.video)"
              class="block absolute bg-red-lighter pin-r rounded-full p-1 z-50 w-5 focus:outline-none"
              style="top: -.5em; right: -.5em"
            >
              <span class="text-xs block">🗑️</span>
            </button>
            <figure>
              <img
                :src="'https://i.ytimg.com/vi/' + video.video + '/default.jpg'"
                alt="video"
                class="w-full"
              >
            </figure>
            <div class="m-2 text-sm">
              <p>{{video.title}}</p>
              <p class="font-light text-orange mt-1 text-right">👤 {{video.user}}</p>
            </div>
          </div>
        </div>
      </div>
      <h2 v-else class="text-center self-center mx-auto">Empty playlist, add some videos 😉</h2>
    </pou-bordered>
  </div>
</template>

<script>
import pouBordered from "./pou-bordered";
export default {
  name: "pou-list",
  components: {
    pouBordered
  },
  props: ["user"],
  data() {
    return {
      list: []
    };
  },
  methods: {
    remove(videoId) {
      this.$socket.emit("remove", this.user, videoId);
    }
  },
  sockets: {
    queue([user, list]) {
      this.list = list;
    }
  }
};
</script>