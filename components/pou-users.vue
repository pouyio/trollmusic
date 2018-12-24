<template>
  <div class="relative pt-4">
    <div class="border rounded pt-4 p-2" :class="[users.length < 1 ? 'bg-grey-lighter' : '']">
      <h2 class="absolute pin-t bg-white rounded-full px-2">👥</h2>
      <div v-if="users.length > 1">
        <p
          v-for="user of otherUsers"
          :key="user.user"
          class="text-xs my-1 py-1 px-2 bg-grey inline-block rounded-full text-grey-lightest"
        >{{ user.user }}</p>
      </div>
      <h2 v-else class="text-center">No users ☹️</h2>
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