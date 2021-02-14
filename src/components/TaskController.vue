<template>
    <div class="tasks">
        <h3>
            <div class="name">{{task}}</div>
            <button class="close" @click="$emit('close')">
                <fa-icon icon="times"></fa-icon>
            </button>
        </h3>
        <div class="task-window">
            <compare-hash 
                v-if="task == 'compare hash'"
                @done="$emit('done', 'compare hash')"
            ></compare-hash>
            <decrypt-keys
                v-else-if="task == 'decrypt keys'"
                @done="$emit('done', 'decrypt keys')"
            ></decrypt-keys>
            <clear-console
                v-else-if="task == 'clear console'"
                @done="$emit('done', 'clear console')"
            ></clear-console>
            <enter-code
                v-else-if="task == 'enter code'"
                @done="$emit('done', 'enter code')"
            ></enter-code>
            <download-task
                v-else-if="task == 'download'"
                @done="$emit('done', 'download')"
            ></download-task>
            <div v-else class="no-task">
                Task {{task}} not found
            </div>
        </div>
    </div>
</template>

<script>
import CompareHash from '../tasks/CompareHash'
import DecryptKeys from '../tasks/DecryptKeys'
import ClearConsole from '../tasks/ClearConsole'
import EnterCode from '../tasks/EnterCode'
import DownloadTask from '../tasks/DownloadTask'

export default {
    name:"TaskController",
    components: {
        CompareHash,
        DecryptKeys,
        ClearConsole,
        EnterCode,
        DownloadTask,
    },
    props: {
        task: String
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.tasks {
    height:100%;
    display: grid;
    grid-template-rows: auto 1fr;
    max-height: 100%;
    overflow:hidden;

    h3 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background:$thirdary;
        padding:0.2em 0.6em;
        border-top-right-radius: 0.5em;
        border-top-left-radius: 0.5em;
        margin-bottom:0;

        .name {
            font-size:1.2em;
        }

        button {
            @include button-reset;
            width:2em;
        }
    }

    .task-window {
        border:0.4em solid $thirdary;
        border-bottom-right-radius: 0.5em;
        border-bottom-left-radius: 0.5em;
        min-height: 50vh;
        max-height:100%;
        overflow:hidden;
    }

}

</style>