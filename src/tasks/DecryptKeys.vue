<template>
    <article>
        <div class="key-container">
            <div class="key-parts">
                <char-decrypt :done="key1Timer <= 30"></char-decrypt>
                <char-decrypt :done="key1Timer <= 20"></char-decrypt>
                <char-decrypt :done="key1Timer <= 10"></char-decrypt>
                <char-decrypt :done="key1Timer == 0"></char-decrypt>
            </div>
            <div class="progress-container">
                <div v-show="key1Timer == 40" @click="move1" class="progress-start">Decrypt</div>
                <fa-icon v-show="key1Timer == 0" class="progress-done" icon="check"></fa-icon>
                <div class="progress-bar" :class="{working: key1Timer < 40}"></div>
            </div>
        </div>
        <div class="key-container">
            <div class="key-parts">
                <char-decrypt :done="key2Timer <= 30"></char-decrypt>
                <char-decrypt :done="key2Timer <= 20"></char-decrypt>
                <char-decrypt :done="key2Timer <= 10"></char-decrypt>
                <char-decrypt :done="key2Timer == 0"></char-decrypt>
            </div>
            <div class="progress-container">
                <div v-show="key2Timer == 40" @click="move2" class="progress-start">Decrypt</div>
                <fa-icon v-show="key2Timer == 0" class="progress-done" icon="check"></fa-icon>
                <div class="progress-bar" :class="{working: key2Timer < 40}"></div>
            </div>
        </div>
        <div class="key-container">
            <div class="key-parts">
                <char-decrypt :done="key3Timer <= 30"></char-decrypt>
                <char-decrypt :done="key3Timer <= 20"></char-decrypt>
                <char-decrypt :done="key3Timer <= 10"></char-decrypt>
                <char-decrypt :done="key3Timer == 0"></char-decrypt>
            </div>
            <div class="progress-container">
                <div v-show="key3Timer == 40" @click="move3" class="progress-start">Decrypt</div>
                <fa-icon v-show="key3Timer == 0" class="progress-done" icon="check"></fa-icon>
                <div class="progress-bar" :class="{working: key3Timer < 40}"></div>
            </div>
        </div>
        <button v-if="isDone" class="task-done" @click="$emit('done')">
            <fa-icon icon="check"></fa-icon>&nbsp;Task Done
        </button>
    </article>
</template>

<script>
import CharDecrypt from './components/CharDecrypt'

export default {
    name:"DecryptKeys",
    components: {
        CharDecrypt
    },
    data() {
        return {
            key1Timer: 40,
            key1Timeout: null,
            key2Timer: 40,
            key2Timeout: null,
            key3Timer: 40,
            key3Timeout: null,
        }
    },
    computed: {
        isDone() {
            return this.key1Timer === 0 && this.key2Timer === 0 && this.key3Timer === 0
        }
    },
    methods: {
        move1() {
            this.key1Timer -= 1;
            this.key1Timeout = setTimeout(() => {
                if(this.key1Timer > 0) this.move1()
            }, 100)
        },
        move2() {
            this.key2Timer -= 1;
            this.key2Timeout = setTimeout(() => {
                if(this.key2Timer > 0) this.move2()
            }, 100)
        },
        move3() {
            this.key3Timer -= 1;
            this.key3Timeout = setTimeout(() => {
                if(this.key3Timer > 0) this.move3()
            }, 100)
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

article {
    height: 100%;
    width: 100%;
    padding:0.4em;

    display: grid;
    grid-template-rows: repeat(4, 1fr);
}

.key-container {
    margin-bottom:0.4em;
    display: grid;
    grid-template-rows: 1fr auto;
}

.key-parts {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-size:2em;
}

.progress-container {
    height:2em;
    width:100%;
    background:$thirdary;
    border-radius: 1em;
    overflow:hidden;
    
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    .progress-start {
        width:100%;
        height:100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .progress-done {
        z-index: 1;
    }

    .progress-bar {
        height:100%;
        background:$orchid;
        border-radius: 1em;
        transition: width 4s linear;
        width:0%;
        z-index:0;

        display: flex;
        align-items: center;
        justify-content: center;

        position: absolute;
        left:0;
        top:0;
        
        &.working {
            width:100%;
        }
    }
}

.task-done {
    @include button-reset;
    background:white;
    color:black;
    width:100%;
    height:2em;
    margin:auto 0;
}

</style>