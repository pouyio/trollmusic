<template>
  <div class="card">
    <div class="card-header">
      <h1 class="card-header-title title is-centered">💬 Chat</h1>
    </div>
    <div class="card-content" v-if="active && messages.length" style="padding: .75em">
      <div v-for="(message, index) in messages" :key="index">
        <span class="tag is-dark">{{message[0]}}</span>
        {{message[1]}}
      </div>
    </div>
    <footer class="card-footer">
      <div class="card-footer-item">
        <textarea
          :disabled="!active"
          class="resize-y"
          type="text"
          placeholder="Send a message..."
          v-model="message"
          @keyup.enter="submit"
        ></textarea>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "pou-chat",
  props: ["user", "active"],
  data() {
    return {
      message: "",
      messages: []
    };
  },
  methods: {
    submit() {
      this.$socket.emit("message", { user: this.user, message: this.message });
      this.message = "";
    }
  },
  sockets: {
    message({ user, message }) {
      this.messages.push([user, message]);
    }
  },
  watch: {
    active(value) {
      if (!value) {
        this.messages = [];
      }
    }
  }
};
</script>