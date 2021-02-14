<template>
    <article>
        <div class="code-output" :class="{done}">
            <code :class="{correct:isCorrect(0)}">{{attempt[0]}}</code>
            <code :class="{correct:isCorrect(1)}">{{attempt[1]}}</code>
            <code :class="{correct:isCorrect(2)}">{{attempt[2]}}</code>
            <code :class="{correct:isCorrect(3)}">{{attempt[3]}}</code>
        </div>
        <div class="pinpad">
            <button @click="press(1)" :class="{dirty:isDirty(1)}">1</button>
            <button @click="press(2)" :class="{dirty:isDirty(2)}">2</button>
            <button @click="press(3)" :class="{dirty:isDirty(3)}">3</button>
            <button @click="press(4)" :class="{dirty:isDirty(4)}">4</button>
            <button @click="press(5)" :class="{dirty:isDirty(5)}">5</button>
            <button @click="press(6)" :class="{dirty:isDirty(6)}">6</button>
            <button @click="press(7)" :class="{dirty:isDirty(7)}">7</button>
            <button @click="press(8)" :class="{dirty:isDirty(8)}">8</button>
            <button @click="press(9)" :class="{dirty:isDirty(9)}">9</button>
            <button @click="bkspace()"><fa-icon icon="backspace" size="xs"></fa-icon></button>
            <button @click="press(0)" :class="{dirty:isDirty(0)}">0</button>
            <button @click="clr()"><fa-icon icon="times" size="xs"></fa-icon></button>
            <div class="done-overlay" v-show="done"></div>
        </div>
        <button v-if="done" class="task-done" @click="$emit('done')">
            <fa-icon icon="check"></fa-icon>&nbsp;Task Done
        </button>
    </article>
</template>

<script>
import { randRange } from '../assets/helpers'

export default {
    name:"EnterCode",
    data() {
        return {
            attempt: '',
            match: '',
        }
    },
    mounted() {
        this.match = `${randRange(0, 9)}${randRange(0, 9)}${randRange(0, 9)}${randRange(0, 9)}`
    },
    computed: {
        done() {
            return this.attempt === this.match
        }
    },
    methods: {
        press(num) {
            if(this.attempt.length < 4) {
                this.attempt += num
            }
        },
        bkspace() {
            this.attempt = this.attempt.slice(0, -1)
        },
        clr() {
            this.attempt = ''
        },
        isDirty(num) {
            return this.match.includes(`${num}`);
        },
        isCorrect(index) {
            return this.match[index] === this.attempt[index]
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

.code-output {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap:1em;

    code {
        font-size:3em;
        display: flex;
        align-items: center;
        justify-content: center;
        height:1.3em;
        border:1px solid transparent;

        &.correct {
            border-color:$confirm;
        }
    }

    &.done {
        code {
            animation: flash 1s linear;
            background:$confirm;
        }
    }
}

@keyframes flash {
    0% {
        background:$thirdary;
    }
    25% {
        background:$confirm;
    }
    50% {
        background:$thirdary;
    }
    75% {
        background:$confirm;
    }
    100% {
        background:$confirm;
    }
}

.pinpad {
    margin-top:1em;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap:0.2em;
    position: relative;

    button {
        font-size:2.4em;
        position: relative;

        background:$thirdary;
        border:none;
        border-radius: 0.2em;
        height:1.5em;
        color:white;

        display: flex;
        align-items: center;
        justify-content: center;
        
        &.dirty {
            &::after {
                content:'';
                position: absolute;
                left:0;
                top:0;
                width:100%;
                height:100%;
                background:rgba(#35291f, 0.4);
                border-radius: 0.2em;
            }
        }
    }

    .done-overlay {
        position: absolute;
        left:0;top:0;
        height:100%;width:100%;
        background:rgba(black, 0.1);
    }
}

.task-done {
    @include button-done;
}

</style>