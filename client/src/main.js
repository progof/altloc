import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Login from './components/Login.vue';
import Register from './components/Register.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
];

const router = new VueRouter({
  routes,
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
