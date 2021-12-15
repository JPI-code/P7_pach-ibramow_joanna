import Vue from 'vue'
import App from './App.vue'
import Router from './Router.js'
import Axios from 'axios' //Library JS

//where to send requests
Axios.defaults.baseURL = "http://localhost:3000/api"
//in order not to import Axios every time, to keep it in Vue proptotype storage
Vue.prototype.$axios = Axios

new Vue ({
    Router, 
    render: h=> h(App)
})

.$mount("#app")