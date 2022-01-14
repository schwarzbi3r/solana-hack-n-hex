<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Account from '../components/Account.vue'

export default {
  components: { Account },

  data() {
    return {
      addr: '',
      network: '',
    }
  },

  created() {
    this.addr = this.$route.params.address
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        // react to route changes...
        this.addr = toParams.address
        this.network = toParams.network
      }
    )
  },

}

</script>

<template>
  <account :addr="addr" :network="network"></account>
</template>

<style>
</style>
