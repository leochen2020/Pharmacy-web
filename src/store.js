import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 这个理论来说
const store = new Vuex.Store({
  state: {
    token: ''
  }
})

export default store
