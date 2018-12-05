<template>
  <div @click="addVideo" v-bind:style="styles">
    <p style="background-color: white">{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: "video-result",
  props: ["title", "img", "id", "user"],
  data: () => ({
    styleObj: {
      height: "180px",
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
    }
  }
};
</script>