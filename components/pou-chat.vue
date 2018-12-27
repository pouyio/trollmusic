<template>
  <pou-bordered :icon="'💬'" :active="active">
    <h2 class="absolute pin-t bg-white rounded-full px-2"></h2>
    <div class="overflow-hidden h-64" v-chat-scroll="{always: false, scrollonremoved:true}">
      <transition-group name="getin">
        <div
          v-for="(message, index) in messages"
          :key="+index"
          class="py-1 flex flex-col leading-none"
          :class="{'text-right': message[0] === user}"
        >
          <span v-if="message[0] !== user" class="text-xs font-light text-orange">{{message[0]}}</span>
          {{message[1]}}
        </div>
      </transition-group>
    </div>
    <div class="border-t -mx-2 px-2 pt-2 relative">
      <textarea
        :disabled="!active"
        class="resize-y w-full outline-none"
        :class="{'bg-grey-lighter': !active}"
        type="text"
        :placeholder="active ? 'Send a message...' : 'Play something to send a message'"
        v-model="message"
        @keyup.enter="submit"
      ></textarea>
      <emoji-picker :search="search">
        <div
          class="absolute pin-t pin-r p-2 cursor-pointer emoji-invoker outline-none"
          slot="emoji-invoker"
          slot-scope="{ events: { click: clickEvent } }"
          @click="active && clickEvent()"
        >
          <button class="focus:outline-none h-6 w-6 rounded-full">😀</button>
        </div>
        <div slot="emoji-picker" slot-scope="{ emojis }">
          <div
            class="absolute z-10 border mx-2 p-3 pin-b rounded bg-white shadow t-4 h-64 overflow-y-auto mb-16"
          >
            <div class="flex">
              <input
                class="flex-1 rounded-full border py-1 px-2 outline-none text-sm"
                type="text"
                v-model="search"
                v-focus
              >
            </div>
            <div v-for="(emojiGroup, category) in emojis" :key="category">
              <h5 class="text-grey-darker uppercase text-sm cursor-default mb-2 mt-4">{{ category }}</h5>
              <div class="flex flex-wrap justify-between emojis text-lg">
                <button
                  class="p-1 cursor-pointer rounded hover:bg-grey-light focus:outline-none flex items-center justify-center h-6 w-6"
                  v-for="(emoji, emojiName) in emojiGroup"
                  :key="emojiName"
                  @click="append(emoji)"
                  :title="emojiName"
                >{{ emoji }}</button>
              </div>
            </div>
          </div>
        </div>
      </emoji-picker>
    </div>
  </pou-bordered>
</template>

<script>
import pouBordered from "./pou-bordered";
import EmojiPicker from "vue-emoji-picker";
export default {
  name: "pou-chat",
  props: ["user", "active"],
  components: {
    pouBordered,
    EmojiPicker
  },
  data() {
    return {
      message: "",
      messages: [],
      search: ""
    };
  },
  methods: {
    submit() {
      this.$socket.emit("message", { user: this.user, message: this.message });
      this.message = "";
    },
    append(emoji) {
      this.message += emoji;
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
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  }
};
</script>

<style scoped>
.getin-enter-active {
  transition: all 0.4s;
}
.getin-enter {
  opacity: 0;
  transform: translateX(-0.75em);
}
</style>
