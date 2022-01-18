<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'

export default defineComponent({

  props: {
    address: {
      type: String,
      required: true
    },
    linked: {
      type: Boolean,
      required: false,
      default: true,
    }
  },

  data() {
    return {
      copied: ref(false) as Ref<boolean>,
    }
  },

  methods: {
    async copy(_event: Event) {
      const clipboardData = navigator.clipboard;
      clipboardData.writeText(this.address);
      this.copied = true
      setTimeout(() => this.copied = false, 1000);
    }
  }
})

</script>

<template>
  <span v-if="linked">
    <router-link ref="pubKeyLink" :to='{name: "account", params: { address: address }}'>
      <span v-if="copied">Copied!</span><span v-else>{{ address }}</span>
    </router-link>
    <span v-on:click="copy" class="copyIcon">📋</span>
  </span>
  <span v-else>
    <span v-if="copied">Copied!</span><span v-else>{{ address }}</span>
    <span v-on:click="copy" class="copyIcon">📋</span>
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