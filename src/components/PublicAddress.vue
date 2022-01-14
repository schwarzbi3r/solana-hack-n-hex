<script>
import { ref } from 'vue'

export default {

  props: {
    address: ""
  },

  data() {
    return {
      copied: ref(false),
    }
  },

  methods: {
    async copy(event) {
      const clipboardData =
        event.clipboardData ||
        window.clipboardData ||
        event.originalEvent?.clipboardData ||
        navigator.clipboard;
      clipboardData.writeText(this.address);
      this.copied = true
      setTimeout(() => this.copied = false, 1000);
    }
  }
}

</script>

<template>
  <span>
    <span v-on:click="copy" class="copyIcon">📋</span>
    <router-link ref="pubKeyLink" :to='{name: "account", params: { address: address }}'>
      <span v-if="copied">Copied!</span><span v-else>{{ address }}</span>
    </router-link>
  </span>
</template>

<style scoped>
  a {
    font-family: monospace;
  }
  .copyIcon {
    cursor: pointer;
  }
</style>