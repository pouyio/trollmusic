<template>
  <div>
    <nav class="navbar is-fixed-top columns is-vcentered">
      <div class="column">
        <figure class="image is-48x48">
          <img src="/troll.webp">
        </figure>
      </div>
      <div class="column has-text-centered">
        <search :user="user" @found="add" @queue="queue"></search>
      </div>
      <div class="column has-text-right">👤{{ user }}</div>
    </nav>
    <small v-show="userNames.length">Other users: {{ userNames }}</small>
    <div>
      <section style="position: relative;">
        <pou-youtube
          v-if="videoId"
          :video-id="videoId"
          :state="state"
          :seconds="seconds"
          @pause="pause"
          @playing="playing"
          @ended="ended"
        ></pou-youtube>
      </section>
    </div>
    <section v-if="list.length">
      <pou-list :list="list" @reset="reset"></pou-list>
    </section>
  </div>
</template>

<script>
import search from "./components/search.vue";
import pouYoutube from "./components/pou-youtube.vue";
import pouList from "./components/pou-list.vue";

export default {
  name: "App",
  components: {
    search,
    pouYoutube,
    pouList
  },
  data() {
    return {
      videoId: "",
      seconds: 0,
      state: 0,
      user: "",
      percentage: 0,
      percentageShow: 0,
      playerVars: {
        controls: 1,
        disablekb: 1,
        modestbranding: 1,
        showinfo: 0,
        rel: 0
      },
      list: [],
      users: []
    };
  },
  sockets: {
    paused(user) {
      this.state = false;
    },
    playing([video, user, seconds]) {
      this.state = true;
      this.seconds = seconds;
      this.videoId = video;
    },
    queue([user, list]) {
      this.list = list;
    },
    users(users) {
      this.users = users;
    }
  },
  created() {
    // this.user = prompt('Write your username');
    this.user = "pollo" + new Date().getTime();
    this.$socket.emit("set-user", this.user);
  },
  methods: {
    pause() {
      this.state = false;
      this.$socket.emit("paused", this.user);
    },
    playing(seconds) {
      this.state = true;
      this.seconds = seconds;
      this.$socket.emit("playing", this.videoId, this.user, seconds);
    },
    add(video, user) {
      this.$socket.emit("add", video, user);
    },
    queue(video, user) {
      this.$socket.emit("queue", video, user);
    },
    reset() {
      this.$socket.emit("reset", this.user);
    },
    ended(video) {
      this.videoId = null;
      this.$socket.emit("ended", video);
    }
  },
  computed: {
    userNames() {
      return this.users
        .filter(u => u.user !== this.user)
        .map(u => u.user)
        .join(", ");
    }
  }
};
</script>

<style scoped>
.column {
  padding-bottom: 0;
}
</style>


