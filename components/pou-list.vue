<template>
  <div>
    <button @click="reset">Reset ❌</button>
    <ul>
      <li v-for="video in list" :key="video.id">
        <img v-bind:src="'https://i.ytimg.com/vi/' + video.id + '/default.jpg'" alt="">
        {{video.user}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "pou-list",
  props: ["list"],
  methods: {
    reset() {
      this.$emit("reset");
    }
  }
};
</script>