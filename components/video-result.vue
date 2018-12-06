<template>
  <div :style="{width: styleObj.width, margin: '1em auto'}">
    <p style="background-color: white; margin: 0; padding: .4em">{{ title }}</p>
    <div :style="styles"></div>
    <div>
      <div style="display: flex">
        <button style="width: 100%; padding: .4em; cursor: pointer" @click="addVideo">Play now ▶️</button>
        <button style="width: 100%; padding: .4em; cursor: pointer" @click="queueVideo">Add to list ➕</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "video-result",
  props: ["title", "img", "id", "user"],
  data: () => ({
    styleObj: {
      height: "240px",
      width: "320px",
      margin: "auto"
    }
  }),
  computed: {
    styles() {
      return {
        ...this.styleObj,
        background: "url(" + this.img + ") top left / cover no-repeat"
      };
    }
  },
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