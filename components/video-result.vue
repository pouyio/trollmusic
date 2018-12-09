<template>
  <div class="card" style="width: 320px; margin: .4em; overflow: hidden">
    <figure class="image">
      <img :src="img" alt="video image">
    </figure>
    <div class="card-content title is-6 is-marginless" style="padding: 0.3em;">
      <p class="is-centered">{{ title }}</p>
    </div>
    <div class="card-footer is-size-7">
      <a class="card-footer-item" style="padding: 0.3em;" @click="addVideo">Play now ▶️</a>
      <a class="card-footer-item" style="padding: 0.3em;" @click="queueVideo">Add to list ➕</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "video-result",
  props: ["title", "img", "id", "user"],
  data: () => ({
    styleObj: {
      width: "320px"
    }
  }),
  methods: {
    addVideo() {
      this.$emit("found", this.id, this.user);
    },
    queueVideo() {
      this.$emit("queue", this.id, this.user);
    }
  }
};
</script>