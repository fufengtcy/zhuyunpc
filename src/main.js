// import Vue from 'vue'
// import App from './App.vue'
// import router from './router'
// import store from './store'

// Vue.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')
import Vue from "vue";
import Antd from "ant-design-vue";
import App from "./App";
import router from "./router";
import store from "./store";
import axios from "axios";
import "ant-design-vue/dist/antd.css";
Vue.config.productionTip = false;
Vue.use(Antd);
// axios.defaults.baseURL = "https://api5.cvoon.com/base/manage";
axios.defaults.baseURL = "https://api5.cvoon.com";
new Vue({
  el: "#app",
  router,
  store,
  axios,
  components: { App },
  render: (h) => h(App),
}).$mount("#app");
