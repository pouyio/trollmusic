<template>
  <div>
    <button class="button" @click="reset">Reset ❌</button>
    <ul class="is-flex" style="list-style: none; padding: 0; flex-wrap: wrap">
      <li v-for="video in list" :key="video.id" style="display: flex; flex-direction: column">
        <img v-bind:src="'https://i.ytimg.com/vi/' + video.id + '/default.jpg'" alt style="max-width: 150px">
        <span style="background: white">{{video.user}}</span>
      </li>
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