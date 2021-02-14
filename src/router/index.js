import Vue from 'vue'
import VueRouter from 'vue-router'

import Join from '../views/Join.vue'
import Lobby from '../views/Lobby.vue'
import Game from '../views/Game.vue'
import Meeting from '../views/Meeting.vue'
import Victory from '../views/Victory.vue'

import store from '../store'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Join',
      component: Join
    },
    {
      path: '/lobby',
      name: 'Lobby',
      component: Lobby,
      beforeEnter: (to, from, next) => {
        if(!store.state.room) {
          next({ name: 'Join' })
        } else {
          next();
        }
      }
    },
    {
      path: '/game',
      name: 'Game',
      component: Game,
      beforeEnter: (to, from, next) => {
        if(!store.state.room) {
          next({ name: 'Join' })
        } else {
          next();
        }
      }
    },
    {
      path: '/meeting',
      name: 'Meeting',
      component: Meeting,
      beforeEnter: (to, from, next) => {
        if(!store.state.room) {
          next({ name: 'Join' })
        } else if(!store.state.meeting) {
          next({ name: 'Game' })
        } else {
          next();
        }
      }
    },
    {
      path: '/victory',
      name: 'Victory',
      component: Victory,
      beforeEnter: (to, from, next) => {
        if(!store.state.room) {
          next({ name: 'Join' })
        } else if(!store.state.victory) {
          next({ name: 'Game' })
        } else {
          next();
        }
      }
    },
    {
      path: '/task-test',
      name: 'TaskTest',
      component: () => import(/* webpackChunkName: "taskTest" */ '../views/TaskTest.vue'),
    }
  ]
})

export default router
