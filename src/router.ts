import Router from 'vue-router'
import Todolist from './Views/Todolist.vue'
import TEST from './Views/TEST.vue'
import Authorization from './components/Authorization.vue'

export const router = new Router({
  routes: [
    { path: '/test', component: TEST, props: { signup: true } },
    {
      path: '/',
      name: 'Todolist',
      component: Todolist,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Authorization,
          props: { signup: false }
        },
        {
          path: 'signup',
          name: 'Signup',
          component: Authorization,
          props: { signup: true }
        }
      ]
    }
  ],
  mode: 'history'
})
