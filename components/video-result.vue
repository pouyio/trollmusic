<template>
     <div @click="addVideo()" v-bind:style="styles"> 
        <p style="background-color: white">
            {{ title }} 
        </p>
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
    styles: function() {
      return {
        ...this.styleObj,
        background: "url(" + this.img + ") top left / cover no-repeat"
      };
    }
  },
  methods: {
    addVideo: function() {
      this.$emit("found");
      fetch("http://localhost:8080/video", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user: this.user, video: this.id })
      });
    }
  }
};
</script>