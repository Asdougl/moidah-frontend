<template>
    <article>
        <div class="indicator">
            <div class="bar-container">
                <div class="bar" :class="{working:wait !== null}"></div>
            </div>
            <input type="range">
        </div>
        <div class="actions">
            <button @click="start">Start</button>
            <button @click="stop">Stop</button>
        </div>
    </article>
</template>

<script>
export default {
    name:"DownloadTask",
    data() {
        return {
            wait: null
        }
    },
    methods: {
        start() {
            this.wait = 'hi'
        },
        stop() {
            this.wait = null
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

article {
    height: 100%;
    width: 100%;
    padding:0.4em;
    position: relative;

    display: grid;
    grid-template-rows: 1fr auto;
}

.indicator {
    display: flex;
    justify-content: space-between;

    .bar-container {
        border:1px solid white;
        height:2em;
        width:100%;
        padding:2px;

        .bar {
            height:100%;
            background:$confirm;
            width:0%;

            &.working {
                animation: load 4s linear;
                width:100%;
            }
        }
    }
}

@keyframes load {
    0% {
        width:0%;
    }
    20% {
        width:15%;
    }
    40% {
        width:30%;
    }
    70% {
        width:32%
    }
    80% {
        width:55%
    }
    100% {
        width:100%;
    }
}

.task-done {
    @include button-done;
}

</style>