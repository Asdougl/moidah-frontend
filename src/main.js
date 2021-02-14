import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCrown, faKnifeKitchen, faUsers, faCircle, faCheckCircle, faBarcodeRead, faQrcode, faTimes, faCheck, faBackspace, faFolder, faFolderOpen, faCommentAltLines, faSkull, faPaperPlane, faCommentAltDots, faBullhorn, faSignOut, faPlay, faEllipsisH } from "@fortawesome/pro-solid-svg-icons";
library.add( faCrown, faKnifeKitchen, faUsers, faCircle, faCheckCircle, faBarcodeRead, faQrcode, faTimes, faCheck, faBackspace, faFolder, faFolderOpen, faCommentAltLines, faSkull, faPaperPlane, faCommentAltDots, faBullhorn, faSignOut, faPlay, faEllipsisH )
Vue.component('fa-icon', FontAwesomeIcon)

// Socket IO
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

document.title = "Moidah"

Vue.use(new VueSocketIO({
  debug: true,
  connection: '192.168.0.41:3000',
  vuex: {
    store,
    actionPrefix: 'SOCKET_'
  }
}))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
