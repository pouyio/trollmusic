<template>
  <div>
    <nav class="flex bg-white h-16 items-center border-b border-orange-light shadow">
      <div class="w-full max-w-2xl relative mx-auto md:px-6">
        <div class="flex items-center justify-around">
          <figure class="md:w-1/4 xl:w-1/5 md:px-6 pr-8">
            <img @click="toggleBackground" class="cursor-pointer h-16 w-auto" src="/lol.gif">
          </figure>
          <pou-search class="md:w-3/4 xl:w-4/5 md:px-6 xl:px-12" :user="user"></pou-search>
          <div class="md:w-1/4 xl:w-1/5 md:px-6 pl-8 text-orange-darkest break-words">
            <p>👤{{ user }}</p>
          </div>
        </div>
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
    this.user = "pollo" + (new Date().getTime() % 100000);
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


