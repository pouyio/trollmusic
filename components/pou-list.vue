<template>
  <div class="pt-2">
    <pou-bordered :icon="'🔜'" :active="list.length" class="p-4">
      <draggable
        class="flex flex-wrap justify-around"
        v-if="list.length"
        v-model="list"
        @start="drag=true"
        @end="drag=false"
        @change="checkMove"
      >
        <div
          v-for="video in list"
          :key="video.video"
          class="w-32 md:w-48 md:m-2 m-1 border rounded md:flex-initial flex-grow relative cursor-move"
        >
          <div class="overflow-hidden">
            <button
              @click="remove(video.video)"
              class="block absolute bg-red-lighter pin-r rounded-full p-1 w-5 focus:outline-none"
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
      </draggable>
      <h2 v-else class="text-center self-center mx-auto">Empty playlist, add some videos 😉</h2>
    </pou-bordered>
  </div>
</template>

<script>
import pouBordered from "./pou-bordered";
import draggable from "vuedraggable";
import { channel } from "../ably/ably";
export default {
  name: "pou-list",
  components: {
    pouBordered,
    draggable
  },
  props: ["user"],
  data() {
    return {
      list: [],
      firstLoad: true
    };
  },
  created() {
    // this.$socket.emit("initial-queue");
    channel.subscribe("queue", ({ data }) => {
      if (!this.list.some(d => d.video === data.video)) {
        this.list.push(data);
      }
    });

    channel.subscribe("remove", ({ data }) => {
      this.list = this.list.filter(item => item.video !== data);
    });

    channel.subscribe("reorder", ({ data }) => {
      this.list = data;
    });

    channel.subscribe("request-info", () => {
      if (this.list.length) {
        channel.publish("info-list", this.list);
      }
    });

    channel.subscribe("info-list", ({ data }) => {
      if (this.firstLoad) {
        this.list = data;
        this.firstLoad = false;
      }
    });

    channel.subscribe("ended", ({ data }) => {
      this.list = this.list.filter(v => v.video !== data);
      this.$emit('next', this.list.shift());
    });
  },
  methods: {
    remove(videoId) {
      channel.publish("remove", videoId);
    },
    checkMove() {
      channel.publish("reorder", this.list);
    }
  }
};
</script>