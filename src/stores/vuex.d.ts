import * as web3 from '@solana/web3.js'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface State {
    connection: null | web3.Connection
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}