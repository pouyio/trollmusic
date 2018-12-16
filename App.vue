<template>
  <div>
    <nav class="navbar is-fixed-top columns is-vcentered is-mobile" style="border-bottom: 0.2em solid var(--custom-color);">
      <div class="column is-paddingless">
        <figure class="image">
          <img @click="toggleBackground" style="width: 5.5em; cursor: pointer" src="/lol.gif">
        </figure>
      </div>
      <div class="column has-text-centered">
        <pou-search :user="user"></pou-search>
      </div>
      <div class="column has-text-right">👤{{ user }}</div>
    </nav>
    <main class="container column is-fluid">
      <div class="columns">
        <div class="column is-3">
          <pou-chat :user="user" :active="!!videoId"></pou-chat>
        </div>
        <div class="column">
          <pou-youtube></pou-youtube>
        </div>
        <div class="column is-3">
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
      <section class="columns">
        <div class="column">
          <pou-list :user="user"></pou-list>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import pouSearch from "./components/pou-search.vue";
import pouYoutube from "./components/pou-youtube.vue";
import pouList from "./components/pou-list.vue";
import pouChat from "./components/pou-chat.vue";

export default {
  name: "App",
  components: {
    pouSearch,
    pouYoutube,
    pouList,
    pouChat
  },
  data() {
    return {
      videoId: "",
      user: "",
      users: [],
      backgroundImage: "bg-1"
    };
  },
  sockets: {
    users(users) {
      this.users = users;
    }
  },
  created() {
    // this.user = prompt("Write your username");
    this.user = "pollo" + new Date().getTime();
    this.$socket.emit("set-user", this.user);
  },
  methods: {
    toggleBackground() {
      const body = document.querySelector("body");
      const classToAdd = body.classList.contains("bg-1") ? "bg-2" : "bg-1";
      const classToRemove = classToAdd === "bg-1" ? "bg-2" : "bg-1";
      body.classList.remove(classToRemove);
      body.classList.add(classToAdd);
    }
  },
  computed: {
    otherUsers() {
      return this.users.filter(u => u.user !== this.user);
    }
  }
};
</script>


