import * as web3 from '@solana/web3.js'

export default {
  state () {
    return {
      connection: null,
    }
  },
  mutations: {
    connect(state, network, status='confirmed') {
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