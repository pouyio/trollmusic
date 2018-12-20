<template>
  <div v-if="list.length">
    <button class="button" @click="reset">Reset ❌</button>
    <div class="is-flex">
      <div v-for="video in list" :key="video.video" style="width: 10em;margin: .5em;">
        <div class="card" style="overflow: hidden">
          <div class="card-image">
            <figure class="image">
              <img v-bind:src="'https://i.ytimg.com/vi/' + video.video + '/default.jpg'" alt>
            </figure>
          </div>
          <div class="card-content is-paddingless">
            <div class="column">
              <p style="line-height: 1">{{video.title}}</p>
              <p class="is-size-7">{{video.user}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pou-list",
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