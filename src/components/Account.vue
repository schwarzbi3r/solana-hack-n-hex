<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import * as web3 from '@solana/web3.js'
import HexViewer from './HexViewer.vue'
import PublicAddress from './PublicAddress.vue'

export default defineComponent({
  components: { HexViewer, PublicAddress },

  props: {
    addr: {
      type: String,
      required: true
    },
    network: {
      type: String,
      required: true
    },
  },

  data() {
    return {
      loading: ref(true) as Ref<boolean>,
      account: ref(null) as Ref<web3.AccountInfo<Buffer> | null>,
      error: ref(null) as Ref<String | null>,
    }
  },

  created() {
    console.log("Fetching account:", this.addr)
    this.$watch('addr', (newVal: string) => {
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
    isOnCurve(): boolean {
      return web3.PublicKey.isOnCurve(new web3.PublicKey(this.addr).toBytes())
    }
  },

  methods: {
    async fetchAccount(addr: string) {
      this.loading = true
      this.error = null

      try {
        const accountAddr = new web3.PublicKey(addr)
        const connection = this.$store.state.connection

        if (!connection) {
          throw new TypeError("Unable to make connection")
        }

        this.account = await connection.getAccountInfo(accountAddr)

        if (!this.account) {
          this.error = 'Account not found'
        }

        this.loading = false
      } catch (e: unknown) {
        if (e instanceof Error) this.error = e.message
        this.loading = false
        return
      }

    }
  }
})

</script>

<template>
  <div v-if="error" class="text-center">
    <h3>{{ error }}</h3>
  </div>

  <div v-if="!loading && account && !error" class="mb-10">
    <table>
      <tr>
        <td>
          Account
        </td>
        <td>
          <public-address :address="addr" :linked="false"/>
        </td>
      </tr>
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
      <tr>
        <td>
          Is On Curve (<a href="https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses">PDA</a>)
        </td>
        <td>
          {{ isOnCurve }}
        </td>
      </tr>
    </table>
    <div v-if="!loading && dataView">
      <h4 class="mt-4">Data</h4>
      <hr class="mt-1 mb-2" />
      <hex-viewer :data-view="dataView"/>
    </div>
    <div v-else>
    <h4>No Data</h4>
    </div>
  </div>
</template>

<style scoped>
table td:nth-child(1) {
  font-weight: 600;
}
table td:nth-child(2) {
  font-family: monospace;
  padding-left: 2em;
}
a {
  color: #42b983;
}
</style>
