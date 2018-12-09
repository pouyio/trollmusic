<template>
  <div>
    <nav class="navbar is-fixed-top columns is-vcentered is-mobile">
      <div class="column is-paddingless">
        <figure class="image">
          <img @click="modalShow = true" style="width: 5.5em; cursor: pointer" src="/lol.gif">
        </figure>
      </div>
      <div class="column has-text-centered">
        <search :user="user" @found="add" @queue="queue"></search>
      </div>
      <div class="column has-text-right">👤{{ user }}</div>
    </nav>
    <main class="container column is-fluid">
      <div class="columns">
        <div class="column">
          <pou-youtube
            v-if="videoId"
            :video-id="videoId"
            :state="state"
            :seconds="seconds"
            @pause="pause"
            @playing="playing"
            @ended="ended"
          ></pou-youtube>
          <div class="content has-text-centered" style="width: fit-content; margin: auto;" v-else>
            <div class="card" style="overflow: hidden">
              <div class="image">
                <img src="/ben.jpg" alt="sad ben">
              </div>
              <div class="card-content">
                <h1 class>
                  😱 NO VIDEO YET...
                  <span class="is-size-4">try searching ☝️</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-narrow">
          <div class="card" v-if="users.length > 1">
            <div class="card-header">
              <h1 class="card-header-title title is-centered">👥 Users</h1>
            </div>
            <div class="card-content">
              <p v-for="user of otherUsers" :key="user.user">{{ user.user }}</p>
            </div>
          </div>
          <div class="card" v-else>
            <div class="card-header">
              <h1 class="card-header-title title is-centered">No users ☹️</h1>
            </div>
          </div>
        </div>
      </div>
      <section v-if="list.length" class="columns">
          <div class="column">
            <pou-list :list="list" @reset="reset"></pou-list>
          </div>
      </section>
    </main>
    <div class="modal" :class="{'is-flex': modalShow}" @click="modalShow = false">
      <div class="modal-background"></div>
      <div class="modal-content">
        <p class="image">
          <img src="lol.gif">
        </p>
      </div>
    </div>
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
      users: [],
      modalShow: false
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
    this.user = prompt('Write your username');
    // this.user = "pollo" + new Date().getTime();
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
    otherUsers() {
      return this.users.filter(u => u.user !== this.user);
    }
  }
};
</script>

<style scoped>
.column {
  padding-bottom: 0;
}
.navbar {
  border-bottom: 0.2em solid var(--custom-color);
}
</style>


