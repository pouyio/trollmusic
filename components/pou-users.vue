<template>
  <div class="relative pt-4">
    <div class="border rounded pt-4 p-2 h-full flex" :class="[!otherUsers.length ? 'bg-grey-lighter' : '']">
      <h2 class="absolute pin-t bg-white rounded-full px-2">👥</h2>
      <div v-if="otherUsers.length">
        <p
          v-for="user of otherUsers"
          :key="user.user"
          class="text-xs my-1 py-1 px-2 bg-grey inline-block rounded-full text-grey-lightest font-light"
        >{{ user.user }}</p>
      </div>
      <h2 v-else class="text-center self-center mx-auto">No users ☹️</h2>
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