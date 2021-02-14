<template>
    <article>
        <div class="console">
            <h3>Error Log</h3>
            <small>Swipe to Clear</small>
            <swipe-away
                v-for="(error, index) in errors"
                :key="error"
                class="logged"
                @remove="removeError(index)"
                tag="code"
            >{{error}}</swipe-away>
        </div>
        <button v-if="isDone" class="task-done" @click="$emit('done')">
            <fa-icon icon="check"></fa-icon>&nbsp;Task Done
        </button>
    </article>
</template>

<script>
import { randRange } from '../assets/helpers'
import SwipeAway from './components/SwipeAway'

export default {
    name:"ClearConsole",
    components: {
        SwipeAway
    },
    data() {
        return {
            errors: [],
            types: ['ERROR', 'WARN ', 'CRIT ', 'OOFT '],
            isDone: false
        }
    },
    mounted() {
        const numErrors = randRange(20,26);
        for(let i = 0; i < numErrors; i++) {
            this.errors = [...this.errors, `[${this.types[randRange(0,3)]}] Code: ${this.randomErrorCode()}`];
        }
    },
    methods: {
        randomErrorCode() {
            return randRange(100,999) + '.' + randRange(100,999) + '.' + randRange(100,999)
        },
        removeError(index) {
            console.log("Hi :)")
            this.errors.splice(index, 1);
            if(this.errors.length == 0) {
                this.isDone = true
            }
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
    overflow:hidden;
    
}

.console {

    h3 {
        margin:0;
        text-align: center;
    }

    small {
        text-align: center;
        display: block;
        opacity: 0.6;
    }

    code {
        display: inline-block;
        width:100%;

        &:hover {
            opacity: 0.8;
        }
    }
}

.task-done {
    @include button-done;
}

</style>