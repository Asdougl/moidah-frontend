<template>
    <main>
        <h2 class="health">{{alive ? 'ALIVE' : 'DEAD'}}</h2>
        <role-flyover ref="role" :role="role"></role-flyover>
        <death-flyover cause="vote"></death-flyover>
        <template v-if="!murdered">
            <div class="task-progress-container">
                <div class="task-progress-fill" :style="{width: `${progress}%`}"></div>
            </div>
            <template v-if="!currTask">
                <h3>Your Tasks</h3>
                <ul class="tasks">
                    <li
                        v-for="(task, key) in tasks"
                        :key="key"
                        :class="{done:task}"
                        @click="taskFromTheGrave(key)"
                    >
                        <div class="status">
                            <fa-icon :icon="task ? 'check-circle' : 'circle'"></fa-icon>
                        </div>
                        <div class="name">
                            {{key}}
                        </div>
                    </li>
                </ul>
            </template>
            <template v-else>
                <task-controller 
                    v-if="debugTasks === false" 
                    :task="currTask" 
                    @done="finTask"
                    @close="currTask = ''"
                ></task-controller>
            </template>
        </template>
        <div v-show="murdered" class="murderqr" ref="murderqr"></div>
        <nav class="bottom">
            <div class="open-camera" :class="{show: showCamera}" v-if="!murdered && !currTask && alive">
                <div class="title" @click="showCamera = !showCamera"><fa-icon icon="barcode-read"></fa-icon></div>
                <div class="camera">
                    <div v-show="loadingCamera || qrerror" class="camera-message">
                        {{qrerror || 'Loading...'}}
                    </div>
                    <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
                </div>
            </div>
            <div class="open-death-chat" :class="{show: showDeathChat}" v-else-if="!alive && !currTask">
                <div class="title" @click="toggleDeathChat" :class="{'new-msg':hasUnread}">
                    <fa-icon :icon="hasUnread ? 'comment-alt-dots' : 'comment-alt-lines'"></fa-icon>
                </div>
                <chat-log class="chat-log" @new-message="gotNewMessage"></chat-log>
            </div>
            <div class="actions">
                <button @click="imDead">
                    <fa-icon icon="knife-kitchen"></fa-icon> Murdered
                </button>
                <button @click="setIntroduced(false)">
                    My Role
                </button>
                <button @click="debugMeeting()">
                    Debug Meeting
                </button>
            </div>
        </nav>
    </main>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { QrcodeStream } from 'vue-qrcode-reader'
import qrcode from "qrcode-generator";

import RoleFlyover from '../components/RoleFlyover'
import DeathFlyover from '../components/DeathFlyover'
import TaskController from '../components/TaskController'
import ChatLog from '../components/ChatLog'

export default {
    name:"Game",
    components: {
        QrcodeStream,
        RoleFlyover,
        DeathFlyover,
        TaskController,
        ChatLog,
    },
    data() {
        return {
            currTask: '',
            taskError: '',
            qrerror: '',
            loadingCamera: false,
            murdered: false,
            showCamera: false,
            showDeathChat: false,
            debugTasks: false,
            hasUnread: false,
        }
    },
    computed: {
        ...mapState(['tasks', 'role', 'progress', 'alive', 'myid'])
    },
    methods: {
        ...mapMutations(['finishTask', 'getMurdered', 'setIntroduced']),
        finTask() {
            this.$socket.emit('taskComplete', this.currTask)
            this.finishTask(this.currTask)
            this.currTask = '';
        },
        imDead() {
            if(this.role == 'innocent') {
                this.$socket.emit('murdered')
                this.getMurdered()
                this.murdered = true

                const qr = qrcode(4, 'L')
                qr.addData(`moidah:corpse:${this.myid}`)
                qr.make()
                console.log(this.$refs.murderqr);
                this.$refs.murderqr.innerHTML = qr.createSvgTag({ scalable: true });
            }
        },
        taskFromTheGrave(task) {
            // if(this.alive === false) this.currTask = task;
            console.log("I am doing tasks from the grave");
            this.currTask = task;
        },
        refreshRole() {
            this.$refs.role.reshow()
        },
        gotNewMessage() {
            if(!this.showDeathChat) this.hasUnread = true;
        },
        toggleDeathChat() {
            if(!this.showDeathChat) {
                this.showDeathChat = true;
                this.hasUnread = false;
            } else {
                this.showDeathChat = false;
            }
        },
        onDecode(result) {
            const [moidah, func, arg] = result.split(':');
            if(moidah == 'moidah') {

                // Scanning Task
                if(func == 'task' && arg) {
                    const task = arg.replace(/_/g, ' ');
                    if(Object.keys(this.tasks).includes(task)) {
                        this.currTask = task;
                        this.qrerror = '';
                        this.showCamera = false;
                    } else {
                        this.qrerror = `${task} isn't one of your tasks honey...`
                    }
                }

                // Scanning Meeting
                if(func == 'meeting') {
                    console.log("MEETING TIME")
                    this.$socket.emit('callMeeting')
                }

                // Scanning Corpse
                if(func == 'corpse' && arg) {
                    console.log("MEETING TIME + CORPSE")
                    this.$socket.emit('callMeeting', arg)
                }
                
            }
        },
        async onInit(promise) {
            try {
                this.loadingCamera = true;
                await promise
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    this.qrerror = "ERROR: you need to grant camera access permisson"
                } else if (error.name === 'NotFoundError') {
                    this.qrerror = "ERROR: no camera on this device"
                } else if (error.name === 'NotSupportedError') {
                    this.qrerror = "ERROR: secure context required (HTTPS, localhost)"
                } else if (error.name === 'NotReadableError') {
                    this.qrerror = "ERROR: is the camera already in use?"
                } else if (error.name === 'OverconstrainedError') {
                    this.qrerror = "ERROR: installed cameras are not suitable"
                } else if (error.name === 'StreamApiNotSupportedError') {
                    this.qrerror = "ERROR: Stream API is not supported in this browser"
                }
            } finally {
                this.loadingCamera = false;
            }
        },
        debugMeeting() {
            this.$socket.emit('callMeeting')
        }
    }
}
</script>

<style scoped lang="scss">
@import '../style/variables';

main {
    @include main-container;
    display: flex;
    flex-direction: column;
}

h2.health {
    width:100%;
    margin:0;
    text-align: center;
    letter-spacing: 0.3em;
}

.task-progress-container {
    height:1.4em;
    width:100%;
    background:$thirdary;
    margin:.2em 0em;
    border-radius: 1em;
    
    .task-progress-fill {
        width:10%;
        height:100%;
        background:linear-gradient(90deg, $orchid, $yellow);
        border-radius: 1em;
    }
}

h3 {
    font-size:1.4em;
    text-align: center;
}

ul.tasks {
    list-style: none;
    padding:0;margin:0;
    
    li {
        margin:0.4em 0.2em;
        display: grid;
        grid-template-columns: auto 1fr;
        background:$thirdary;
        padding:0.4em 0.6em;
        border-radius: 1em;
        font-size:1.4em;

        .name {
            margin-left:0.8em;
            margin-top:-1px;
        }

        &.done {
            .name {
                text-decoration: line-through;
            }
        }
    }
}

.murderqr {
    width:100%;
    border-radius: 2em;
    overflow: hidden;
}

nav.bottom {
    @include bottom-nav-container;
    .actions {
        @include bottom-nav-content;
        @include bottom-nav-buttons;
    }

    .open-camera, .open-death-chat {
        background:$thirdary;
        font-size:1.4em;
        border-top-left-radius: 0.8em;
        border-top-right-radius: 0.8em;
        height:2em;
        overflow-y:hidden;
        max-height:90vh;
        
        width:100%;
        max-width: 700px;
        margin:0 auto;

        &.show {
            height:auto;
        }

        .title {
            height:2em;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            &.new-msg {
                color:$yellow;
                animation: newmessage 2s linear infinite;
            }
        }

        .camera {
            padding:0.1em;
            background:linear-gradient(90deg, $orchid, $yellow);
            position: relative;

            .camera-message {
                position: absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}

@keyframes newmessage {
    0% {
        color:$yellow;
    }
    50% {
        color:$orchid;
    }
    100% {
        color:$yellow;
    }
}


</style>

<style lang="scss">
@import '../style/variables';

.murderqr {
    svg {
        rect {
            fill:$thirdary;
        }
        path {
            fill:$text;
        }
    }
}

</style>