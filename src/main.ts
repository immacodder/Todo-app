import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import Router from 'vue-router'
import { router } from './router'
Vue.config.productionTip = false

// firebase setup
const firebaseConfig = {
  apiKey: 'AIzaSyDJ4xDJgrPFWdvUZUrby4V_8AaGRO0jeWc',
  authDomain: 'todo-app-3a153.firebaseapp.com',
  projectId: 'todo-app-3a153',
  storageBucket: 'todo-app-3a153.appspot.com',
  messagingSenderId: '41594852365',
  appId: '1:41594852365:web:71ecd8ce399affd00af144'
}

firebase.initializeApp(firebaseConfig)
export { firebase }
/////////////////////

Vue.use(Router)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
