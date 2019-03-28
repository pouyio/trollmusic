<template>
  <pou-bordered icon="👥" :active="otherUsers.length">
    <h2 class="absolute pin-t bg-white rounded-full px-2">👥</h2>
    <div v-if="otherUsers.length">
      <p
        v-for="user of otherUsers"
        :key="user"
        class="text-xs my-1 py-1 px-2 bg-grey inline-block rounded-full text-grey-lightest font-light"
      >{{ user }}</p>
    </div>
    <h2 v-else class="text-center self-center mx-auto">No users ☹️</h2>
  </pou-bordered>
</template>

<script>
import pouBordered from "./pou-bordered";
import { channel } from "../ably/ably.js";

export default {
  name: "pou-users",
  props: ["user"],
  components: {
    pouBordered
  },
  data() {
    return {
      users: []
    };
  },
  created() {
    channel.presence.subscribe("enter", member => {
      channel.presence.get((err, members) => {
        this.users = members.map(presence => presence.clientId);
      });
    });
    channel.presence.subscribe("leave", member => {
      channel.presence.get((err, members) => {
        this.users = members.map(presence => presence.clientId);
      });
    });
  },
  computed: {
    otherUsers() {
      return this.users.filter(u => u !== this.user);
    }
  }
};
</script>