<template>
  <div class="pt-2">
    <pou-bordered :icon="'🔜'" :active="true" v-if="list.length" class="p-4">
      <button class @click="reset">Reset ❌</button>
      <div class="flex flex-wrap">
        <div v-for="video in list" :key="video.video" style="width: 10em;margin: .5em;">
          <div class>
            <div class>
              <figure class>
                <img :src="'https://i.ytimg.com/vi/' + video.video + '/default.jpg'" alt>
              </figure>
            </div>
            <div class>
              <div class>
                <p>{{video.title}}</p>
                <p>{{video.user}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    reset() {
      this.$socket.emit("reset", this.user);
    }
  },
  sockets: {
    queue([user, list]) {
      this.list = list;
    }
  }
};
</script>