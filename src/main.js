import Vue from 'vue'
import App from './App'

window.eventBus = new Vue()

Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
