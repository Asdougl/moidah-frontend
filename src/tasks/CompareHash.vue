<template>
    <article>
        <div class="find">
            <div class="search">
                <code :class="{comparing}">{{searchFor}}</code>
                <draggable v-model="attempt" :group="{ name: 'hashes', pull: false, put: attempt.length < 1}" @change="compare" class="drop" :class="{comparing}">
                    <code v-if="attempt.length" :class="{failed}">{{attempt[0]}}</code>
                </draggable>
                <fa-icon icon="check" v-show="match" class="done-icon" size="2x"></fa-icon>
            </div>
        </div>
        <draggable :list="hashes" :group="{ name: 'hashes', pull: 'clone', put:false }" :sort="false" class="hashlist">
            <li
                v-for="(hash, index) in hashes"
                :key="hash + index"
            ><code>{{hash}}</code></li>
        </draggable>
        <button v-if="match" class="task-done" @click="$emit('done')">
            <fa-icon icon="check"></fa-icon>&nbsp;Task Done
        </button>
    </article>
</template>

<script>
import { randStringArray, randRange } from '../assets/helpers'
import draggable from 'vuedraggable'

export default {
    name:"CompareHash",
    components: {
        draggable
    },
    data() {
        return {
            hashes: [],
            searchFor: '',
            attempt:[],
            comparing:false,
            match: false,
            failed: false,
        }
    },
    mounted() {
        const subhashcount = 9;
        const subhashes = randStringArray(subhashcount, 4);
        for(let i = 0; i < 7; i++) {
            this.hashes[i] = `${subhashes[randRange(0, subhashcount - 1)]}${subhashes[randRange(0, subhashcount - 1)]}${subhashes[randRange(0, subhashcount - 1)]}${subhashes[randRange(0, subhashcount - 1)]}`;
        }
        this.searchFor = this.hashes[randRange(0, this.hashes.length - 1)]
    },
    methods: {
        compare(evt) {
            const hash = evt.added.element;
            this.comparing = true;
            this.failed = false;
            setTimeout(() => {
                if(hash === this.searchFor) {
                    this.match = true;
                } else {
                    this.match = false;
                    this.comparing = false;
                    this.failed = true;
                    this.attempt = [];
                }
            }, 3000)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

article {
    @include task-container;
}

.find {
    width:100%;
    
    .search {
        text-align: center;
        position: relative;

        code {
            border:1px solid transparent;

            &.failed {
                border-color:red;
            }
        }

        .done-icon {
            position: absolute;
            left:50%;
            top:50%;
            transform:translate(-50%, -50%);
        }
    }
}

.hashlist {
    list-style: none;
    padding:0;margin:0;

    li {
        text-align: center;
    }
}

.drop {
    min-height:2em;
    list-style: none;
    padding:0;margin:0;
    position: relative;
    margin-bottom:1em;
    border:1px dashed $thirdary;

    &::before {
        content:'Drop to Compare';
        position: absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        opacity: 0.6;
    }
    
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        left:0;
        top:0;
        height:100%;
        width:0%;
        background:$orchid;
        
        opacity: 0;
    }

    &.comparing {
        &::after {
            width:100%;
            opacity: 0.6;
            border-radius: 0.2em;
            transition: width 3s linear;
        }
    }
}

code {
    font-size:1.3em;
    letter-spacing: 2px;   
    position: relative;
    width:100%;
    display: inline-block;
    
    &::after {
        content: '';
        position: absolute;
        left:0;
        top:0;
        height:100%;
        width:0%;
        background:$orchid;
        
        opacity: 0;
    }

    &.comparing {
        &::after {
            width:100%;
            opacity: 0.6;
            border-radius: 0.2em;
            transition: width 3s linear;
        }
    }
}

.task-done {
    @include button-done;
}

</style>