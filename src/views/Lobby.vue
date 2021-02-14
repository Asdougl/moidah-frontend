<template>
    <main>
        <h2 class="roomcode">
            <code>
                <span
                    v-for="(letter, index) in formattedRoomCode.start"
                    :key="index"
                >{{letter}}</span>
            </code>
            <code>
                <span
                    v-for="(letter, index) in formattedRoomCode.end"
                    :key="index"
                >{{letter}}</span>
            </code>
            <button class="qrbutton" @click="createQr">
                <fa-icon icon="qrcode"></fa-icon>
            </button>
        </h2>
        <div class="qrcode" ref="qrcode"></div>
        <button 
            v-if="isLeader"
            class="start" 
            @click="start"
            :disabled="!ready"
        ><fa-icon :icon="ready ? 'play' : 'ellipsis-h'"></fa-icon></button>
        <ul class="roommates">
            <li 
                v-for="player in room.players"
                :key="player.id"
            >
                <span class="ball" :style="{ backgroundColor: player.colour }"></span>
                <span>{{player.username}}</span>
                <span v-if="player.id === room.owner" class="note host">Host</span>
                <span v-if="player.id === myid" class="note you">You</span>
            </li>
        </ul>
        <nav class="bottom-nav">
            <div class="lobby-chat">
                <button @click="toggleChat"><fa-icon :class="{'new-msg':newMessage}" :icon="newMessage ? 'comment-alt-dots' : 'comment-alt-lines'"></fa-icon></button>
                <chat-log v-show="showChat" @new-message="gotNewMessage"></chat-log>
            </div>
        </nav>
        
    </main>
</template>

<script>
import { mapState } from 'vuex'
import qrcode from "qrcode-generator"

import ChatLog from '../components/ChatLog'

export default {
    name: "Lobby",
    components: {
        ChatLog,
    },
    data() {
        return {
            qrgenerated: false,
            showChat: false,
            newMessage: false,
        }
    },
    computed: {
        ...mapState(['room', 'myid']),
        isLeader() {
            return this.room.owner === this.myid
        },
        formattedRoomCode() {
            return {
                start: this.room.roomcode.substr(0,4),
                end: this.room.roomcode.substr(4,4)
            }
        },
        ready() {
            return this.room.players.length > 2
        }
    },
    methods: {
        start() {
            this.$socket.emit('readyRoom')
        },
        leave() {
            this.$socket.emit('leaveRoom')
            this.$router.push({ name: 'Join' })
        },
        createQr() {
            if(!this.qrgenerated) {
                const qr = qrcode(4, 'L')
                qr.addData(`moidah:room:${this.room.roomcode}`)
                qr.make()
                this.$refs.qrcode.innerHTML = qr.createSvgTag({ scalable: true });
                this.qrgenerated = true;
            } else {
                this.qrgenerated = false;
                this.$refs.qrcode.innerHTML = '';
            }
        },
        gotNewMessage() {
            if(!this.showChat) this.newMessage = true;
        },
        toggleChat() {
            this.showChat = !this.showChat;
            this.newMessage = false;
        }
    }
}
</script>

<style scoped lang="scss">
@import '../style/variables';

main {
    @include main-container;
}

h2.roomcode {
    width:100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin:0.4em 0em;

    code {
        background: $thirdary;
        padding:0em 0.2em;
        font-family: 'Roboto Mono';
        font-size: 2rem;
        border-radius: 0.2em;
        
        &:first-child {
            margin-right:0.2em;
        }

        &:last-child {
            margin-left:0.2em;
        }

        span {
            padding:0em 0.2em;
        }
    }

    button.qrbutton {
        font-size:1em;
        background:$thirdary;
        color:$text;
        border:none;
        padding:0.4em 0.6em;
        border-radius: 1em;
        margin-left:0.4em;

        &:hover {
            background:$secondary;
        }
    }
}

.qrcode {
    width:100%;
    border-radius: 2em;
    overflow: hidden;
}

button.start {
    @include button-reset;
    width:60%;
    margin:0 auto;
    display: block;
    margin-bottom:0.8em;

    &:disabled {
        opacity: 0.6;
    }
}

ul.roommates {
    list-style: none;
    padding:0;margin:0;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(288px, 1fr));
    gap:0.8em;

    li {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:1.4em;

        .ball {
            height:1em;
            width:1em;
            border-radius: 50%;

            display: inline-block;
            margin-right:0.4em;
        }

        .note {
            font-size:0.6em;
            padding:0em 0.3em;
            border-radius: 0.25em;
            display: inline-block;
            margin-left:0.6em;

            &.host {
                background:$yellow;
                color:black;
            }

            &.you {
                background:$orchid;
            }
        }
    }
}

nav.bottom-nav {

    .lobby-chat {
        button {
            @include button-reset;
            max-width: 700px;
            margin:0 auto;
            display: block;
            width:100%;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            font-size:1.4em;

            .new-msg {
                color:$yellow;
                animation: newmessage 2s linear infinite;
            }
        }
    }

    @include bottom-nav-container;
    .actions {
        @include bottom-nav-content;
        @include bottom-nav-buttons;
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

.qrcode {
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