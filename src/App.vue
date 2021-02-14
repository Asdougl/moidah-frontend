<template>
  <div id="app">
    <site-navbar></site-navbar>
    <router-view/>
  </div>
</template>

<script>
import SiteNavbar from './components/SiteNavbar'

export default {
  name: "App",
  components: {
    SiteNavbar
  },
  mounted() {
    const globalid = localStorage.getItem('globalid');
    const roomid = localStorage.getItem('roomid');
    if(globalid && roomid) {
      console.log("Found Reconnect Data", globalid, roomid)
      this.$socket.emit('rejoinRoom', globalid, roomid)
    }
  }
}
</script>

<style lang="scss">
@import './style/style.scss';
</style>
