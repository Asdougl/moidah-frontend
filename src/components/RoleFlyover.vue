<template>
    <aside v-if="!introduced">
        <h3>You Are...</h3>
        <h2>{{role}}</h2>
        <h3><button @click="setIntroduced(true)">Got it</button></h3>
        <div class="background-icon">
            <fa-icon :icon="role === 'killer' ? 'knife-kitchen' : 'users'"></fa-icon>
        </div>
    </aside>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
    name: "RoleFlyover",
    props: {
        role: String
    },
    data() {
        return {
            show: true,
        }
    },
    computed: {
        ...mapState(['introduced'])
    },
    methods: {
        ...mapMutations(['setIntroduced'])
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
    grid-template-rows: 1fr 2fr 1fr;

    > * {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    h3 {
        margin:0.8em 0em;
        font-size:2em;
    }

    h2 {
        margin:0;
        font-size:4em;
        letter-spacing: 0.05em;
        animation: fadein 2s linear;
    }

    .background-icon {
        position: absolute;
        top:0;
        left:0;
        height:100%;
        width:100%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.4;
        font-size:6em;
        animation: fadeinbg 2s linear;
        z-index: 0;
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

@keyframes fadein {
    0% {
        opacity: 0;
    }
    40% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes fadeinbg {
    0% {
        opacity: 0;
    }
    40% {
        opacity: 0;
    }
    100% {
        opacity: 0.4;
    }
}

</style>