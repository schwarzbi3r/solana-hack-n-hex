<script>
import { ref } from 'vue'
import * as web3 from '@solana/web3.js'
import HexViewer from './HexViewer.vue'
import PublicAddress from './PublicAddress.vue'

export default {
  components: { HexViewer, PublicAddress },

  props: {
    addr: String,
    network: String
  },

  data() {
    return {
      loading: ref(true),
      account: ref(null),
      error: ref(null),
    }
  },

  created() {
    console.log("Fetching account:", this.addr)
    this.$watch('addr', (newVal) => {
      this.fetchAccount(newVal)
    })
    this.$watch('network', () => {
      this.fetchAccount(this.addr)
    })
    this.fetchAccount(this.addr)
  },

  computed: {
    dataView() {
      if (!this.account) {
        return null
      }

      if (!this.account.data.buffer.byteLength) {
        return null
      }

      return new DataView(this.account.data.buffer)
    },
  },

  methods: {
    async fetchAccount(addr) {
      this.loading = true
      this.error = null

      try {
        const accountAddr = new web3.PublicKey(addr)
        const connection = this.$store.state.connection

        this.account = await connection.getAccountInfo(accountAddr)

        if (!this.account) {
          this.error = 'Account not found'
        }

        this.loading = false
      } catch (e) {
        this.error = e
        this.loading = false
        return
      }

    }
  }
}

</script>

<template>
  <div v-if="error" class="text-center">
    <h3>{{ error }}</h3>
  </div>

  <div v-if="!loading && !error" class="text-center">
    <h3>Account: {{ addr }}</h3>
    <table>
      <tr>
        <td>
          Account Owner
        </td>
        <td>
          <public-address :address="account.owner.toBase58()"/>
        </td>
      </tr>
      <tr>
        <td>
          Executable
        </td>
        <td>
          {{ account.executable ?  "True" : "False" }}
        </td>
      </tr>
      <tr>
        <td>
          Lamports
        </td>
        <td>
          {{ account.lamports }} ({{ account.lamports / 10 ** 7 }} SOL)
        </td>
      </tr>
      <tr>
        <td>
          Rent Epoch
        </td>
        <td>
          {{ account.rentEpoch }}
        </td>
      </tr>
    </table>
    <div v-if="!loading && dataView">
      <h4>Data</h4>
      <hex-viewer :data-view="dataView"/>
    </div>
    <div v-else>
    <h4>No Data</h4>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
