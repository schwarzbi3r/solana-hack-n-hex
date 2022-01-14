<script>

import * as web3 from '@solana/web3.js'

export default {

  created() {
    this.network = this.$route.params.network
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        // react to route changes...
        this.network = toParams.network
        this.setupConnection()
      }
    )
    this.setupConnection()
  },

  data() {
    return {
      network: '',
    }
  },

  methods: {
    setupConnection() {
      this.$store.commit('connect', this.network, 'confirmed')
    }

  },
}

</script>

<template>
  <router-view></router-view>
</template>
