<template>
  <div class="relative pt-4">
    <div class="border rounded pt-4 p-2" :class="{'bg-grey-lighter': !active}">
      <h2 class="absolute pin-t bg-white rounded-full px-2">💬</h2>
      <div class="overflow-hidden h-64" v-chat-scroll="{always: false, scrollonremoved:true}">
        <transition-group name="getin">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="py-1 flex flex-col leading-none"
            :class="{'text-right': message[0] === user}"
          >
            <span v-if="message[0] !== user" class="text-xs font-light text-orange">{{message[0]}}</span>
            {{message[1]}}
          </div>
        </transition-group>
      </div>
      <div class="border-t -mx-2 px-2 pt-2">
        <textarea
          :disabled="!active"
          class="resize-y w-full outline-none"
          :class="{'bg-grey-lighter': !active}"
          type="text"
          :placeholder="active ? 'Send a message...' : 'Play something to send a message'"
          v-model="message"
          @keyup.enter="submit"
        ></textarea>
      </div>
    </div>
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

<style scoped>
.getin-enter-active {
  transition: all .4s;
}
.getin-enter {
  opacity: 0;
  transform: translateX(-.75em);
}
</style>
