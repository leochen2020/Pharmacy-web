// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

axios.defaults.baseURL = '/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.prototype.$ajax = axios

Vue.component('my-component-name', {
  // ... options ...
})
router.beforeEach((to, from, next) => {
  if (to.name !== 'login') {
    if (localStorage.getItem('token')) {
      next()
    } else {
      next({path: '/'})
    }
  } else {
    localStorage.removeItem('token')
    next()
  }
})
