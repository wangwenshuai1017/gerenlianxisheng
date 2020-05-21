import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import About from '@/components/about'
import Tel from '@/components/tel'
import Address from '@/components/address'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },{
      path: '/about',
      name: 'About',
      component: About
    },{
      path: '/tel',
      name: 'Tel',
      component: Tel
    },{
      path: '/address',
      name: 'Address',
      component: Address
    }
  ]
})
