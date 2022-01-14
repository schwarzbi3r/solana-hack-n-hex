<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import * as web3 from '@solana/web3.js'

import Account from '../components/Account.vue'

export default {
  components: { Account },

  data() {
    return {
      address: '',
    }
  },

  methods: {
    lookup() {
      try {
        // Ensure it's a valid address
        new web3.PublicKey(this.address)
        this.$router.push({ name: 'account', params: { address: this.address } })
      } catch (err) {
        console.log(err)
      }
    }
  },

}

</script>

<template>
  <form @submit.prevent="lookup">
    <input v-model="address" placeholder="base58 Address" type='text' class="w-full px-6 py-3 text-lg border border-gray-300 outline-none" />
    <button type="submit">Lookup</button>
  </form>
</template>

<style>
</style>
