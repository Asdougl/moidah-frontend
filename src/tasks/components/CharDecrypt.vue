<template>
    <div class="char-decrypt">{{showChar}}</div>
</template>

<script>
import { randChar } from '../../assets/helpers'

export default {
    name:"CharDecrypt",
    props: {
        done: Boolean
    },
    data() {
        return {
            randTimeout: null,
            showChar: 'X',
        }
    },
    mounted() {
        this.newChar()
    },
    methods: {
        newChar() {
            this.showChar = randChar();
            this.randTImeout = setTimeout(() => {
                if(!this.done) this.newChar()
            })
        }
    }
}
</script>

<style lang="scss">

.char-decrypt {
    font-family: 'Courier New', Courier, monospace;
}

</style>