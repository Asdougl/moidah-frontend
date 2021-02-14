<template>
    <main>
        <h1>
            <span>{{victorMessage}}</span>
            <div class="background-icon">
                <fa-icon :icon="victory == 'killer' ? 'knife-kitchen' : 'users'" size="2x"></fa-icon>
            </div>
        </h1>
        
        
        <nav class="bottom-nav">
            <div class="actions">
                <button @click="done">Return to Lobby</button>
            </div>
        </nav>
    </main>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
    name: "Victory",
    computed: {
        ...mapState(['victory']),
        victorMessage() {
            if(this.victory == 'killer') {
                return 'The Killer has won!'
            } else {
                return 'The Innocents have won!'
            }
        }
    },
    methods: {
        ...mapMutations(['setVictory']),
        done() {
            this.setVictory(null)
            this.$router.push({ name: 'Lobby' })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

main {
    @include main-container;
}

h1 {
    height:60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .background-icon {
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.4;
        font-size:6rem;
    }
}

nav.bottom-nav {
    @include bottom-nav-container;
    .actions {
        @include bottom-nav-content;
        @include bottom-nav-buttons;
    }
}


</style>