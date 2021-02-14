<template>
    <aside v-if="open && lastDeath">
        <h3>There's Been</h3>
        <h2>A Moidah!</h2>
        <h3>Return to the Meeting room immediately</h3>
        <button @click="ok">Got it</button>
    </aside>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: "DeathFlyover",
    props: {
        cause: String
    },
    data() {
        return {
            open: false,
            openTimeout: null
        }
    },
    computed: {
        ...mapState(['lastDeath'])
    },
    mounted() {
        this.changed()
    },
    watch: {
        'lastDeath': function() {
            this.changed()
        }
    },
    methods: {
        ok() {
            clearTimeout(this.openTimeout);
            this.open = false;
        },
        changed() {
            this.open = true;
            clearTimeout(this.openTimeout);
            // this.openTimeout = setTimeout(() => this.open = false, 5000)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

aside {
    position: fixed;
    top:20vh;
    left:15px;
    width:calc(100vw - 30px);
    height:60vh;
    background:linear-gradient(90deg, $orchid, $yellow);
    z-index: 1;
    border-radius: 1em;

    display: grid;
    grid-template-rows: repeat(4, 1fr);

    > * {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    h3 {
        margin:0.8em 0em;
        font-size:2em;
        text-align: center;
    }

    h2 {
        margin:0;
        font-size:4em;
        letter-spacing: 0.05em;

        .ball {
            height:0.6em;
            width:0.6em;
            border-radius: 50%;
            margin-right:0.4em;
        }
    }

    button {
        font-size:1.2em;
        border-radius: 2em;
        border:none;
        background:white;
        padding:0.2em 1em;
        cursor: pointer;
        z-index: 1;
    }
}
</style>