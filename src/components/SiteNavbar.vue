<template>
    <nav>
        <div></div>
        <h1>Moidah</h1>
        <div class="leave" v-if="room !== null && room.state === 'lobby'">
            <button @click="leave">
                <fa-icon icon="sign-out"></fa-icon>
            </button>
        </div>
    </nav>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
    name: "SiteNavbar",
    computed: {
        ...mapState(['room'])
    },
    methods: {
        ...mapMutations(['clearRoom']),
        leave() {
            this.$socket.emit('leaveRoom')
            this.clearRoom();
            this.$router.push({ name: 'Join' })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

nav {
    height:3rem;
    position: relative;
    background:$primary;
    color:white;
    margin-bottom:0.4em;

    display: grid;
    grid-template-columns: repeat(3, 1fr);

    h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 1px;
        margin:0;
    }

    .leave {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding:0.4em;

        button {
            font-size:1.2em;
            background:$thirdary;
            color:$text;
            border:none;
            padding:0.4em 0.6em;
            border-radius: 0.25em;
            margin-left:0.4em;

            &:hover {
                background:$secondary;
            }
        }
    }
    
    &::after {
        content: '';
        height:0.4em;
        width:100%;

        position: absolute;
        top:100%;
        left:0;
        background: linear-gradient(90deg, $orchid, $yellow);
    }
}

</style>