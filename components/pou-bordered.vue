<template>
  <div class="relative pt-4">
    <div class="border rounded pt-4 p-2 h-full" :class="{'bg-grey-lighter': !active}">
      <h2 class="absolute pin-t bg-white rounded-full px-2">{{ icon }}</h2>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "pou-bordered",
  props: ["icon", "active"]
};
</script>
