import * as web3 from '@solana/web3.js'
import { State } from 'vue';

declare global {
  interface Window {
    global: {
      solanaDebug: {
        connection: web3.Connection,
        web3: any
      }
    }
  }
}

export default {
  state (): State {
    return {
      connection: null,
    }
  },
  mutations: {
    connect(state: State, network: web3.Cluster, status:web3.TransactionConfirmationStatus='confirmed') {
      state.connection = new web3.Connection(
        web3.clusterApiUrl(network),
        status,
      );
      // Allow for easy access to the connection and web inside console 
      window.global.solanaDebug = {
        web3: web3,
        connection: state.connection,
      }
    }
  }
}