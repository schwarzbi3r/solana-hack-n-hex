import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createStore } from 'vuex'


import App from './App.vue'
import Network from './Network.vue'
import Account from './views/Account.vue'
import AccountSearch from './views/AccountSearch.vue'

import './index.css'

import connectionStore from './stores/connection'



const routes = [
  {path: '/', redirect: '/devnet'},
  {
    path: '/:network', name: 'network', component: Network, children: [
      { path: '', component: AccountSearch },
      { path: 'account/:address', component: Account, name: 'account' },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const store = createStore(connectionStore)
const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
