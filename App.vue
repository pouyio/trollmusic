<template>
  <div>
    <nav
      class="navbar is-fixed-top"
      style="border-bottom: 0.2em solid var(--custom-color); min-height: auto"
    >
      <div
        class="is-flex"
        style="width: 100%; align-items: center; justify-content: space-between;"
      >
        <figure class="image">
          <img @click="toggleBackground" style="width: 3.3em; cursor: pointer" src="/lol.gif">
        </figure>
        <pou-search style="width: 40vw; position: inherit;" :user="user"></pou-search>
        <div class="navbar-item">👤{{ user }}</div>
      </div>
    </nav>
    <main class="container column is-fluid">
      <div class="columns">
        <div class="column is-3">
          <pou-chat :user="user" :active="active"></pou-chat>
        </div>
        <div class="column">
          <pou-youtube @active="onActive"></pou-youtube>
        </div>
        <div class="column is-3">
          <pou-users :user="user"></pou-users>
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
import pouUsers from "./components/pou-users.vue";

export default {
  name: "App",
  components: {
    pouSearch,
    pouYoutube,
    pouList,
    pouChat,
    pouUsers
  },
  data() {
    return {
      active: false,
      user: "",
      backgroundImage: "bg-1"
    };
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
    },
    onActive(status) {
      this.active = status;
    }
  }
};
</script>


