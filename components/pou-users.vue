<template>
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
</template>

<script>
export default {
  name: "pou-users",
  props: ["user"],
  data() {
    return {
      users: []
    };
  },
  sockets: {
    users(users) {
      this.users = users;
    }
  },
  computed: {
    otherUsers() {
      return this.users.filter(u => u.user !== this.user);
    }
  }
};
</script>