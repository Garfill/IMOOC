import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import Pos from '@/components/Pos'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pos',
      component: Pos,
    }
  ],
  mode: "history",
})
