<template>
  <div class="pt-2">
    <pou-bordered icon="🔜" :active="videos.length" class="p-4">
      <draggable
        class="flex flex-wrap justify-around"
        v-if="videos.length"
        v-model="vids"
        @start="drag=true"
        @end="drag=false"
      >
        <div
          v-for="video in videos"
          :key="video.video"
          class="w-32 md:w-48 md:m-2 m-1 border rounded md:flex-initial flex-grow relative cursor-move"
        >
          <div class="overflow-hidden">
            <button
              @click="remove(video)"
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
              <p v-html="video.title"></p>
              <p class="font-light text-orange-600 mt-1 text-right">👤 {{video.user}}</p>
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
import { db } from "../firebase.js";

export default {
  name: "pou-list",
  components: {
    pouBordered,
    draggable
  },
  props: ["user"],
  firestore() {
    return {
      videos: db.collection("videos").orderBy("order")
    };
  },
  computed: {
    vids: {
      get() {
        return this.videos;
      },
      set(newVideos) {
        newVideos.map((v, i) => {
          db.collection("videos")
            .doc(v[".key"])
            .update({ order: i });
        });
      }
    }
  },
  methods: {
    remove(video) {
      db.collection("videos")
        .doc(video[".key"])
        .delete();
    }
  }
};
</script>