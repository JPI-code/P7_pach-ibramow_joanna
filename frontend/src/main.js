import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import Axios from 'axios' //Library JS

//where to send requests
Axios.defaults.baseURL = "http://localhost:3000/api"
//in order not to import Axios every time, to keep it in Vue proptotype storage
Vue.prototype.$axios = Axios

new Vue ({
    router, 
    render: h=> h(App)
})

.$mount("#app")