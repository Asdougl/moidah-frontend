<template>
    <div class="chat-log">
        <ul class="messages" ref="msglist">
            <li
                v-for="msg in messages"
                :key="msg.timestamp"
                :class="{own: msg.id === myid, server: msg.server !== undefined}"
            >
                <template v-if="msg.server !== undefined">
                    <div class="server-msg">{{msg.server}} &bullet; {{formatDate(msg.timestamp)}}</div>
                </template>
                <template v-else>
                    <div class="ball" :style="{backgroundColor: msg.colour}">
                        <fa-icon v-show="msg.alive === false" class="dead" icon="skull"></fa-icon>
                    </div>
                    <div class="msg">
                        <div class="content">
                            {{msg.message}}
                        </div>
                    </div>
                    <div class="meta">
                        {{msg.username}} &bullet; {{formatDate(msg.timestamp)}}
                    </div>
                </template>
                
            </li>
        </ul>
        <form class="send" @submit="sendMessage">
            <input type="text" v-model="newMessage" placeholder="Aa" ref="sendbox" @focus="scrollBottom"><button @click="sendMessage"><fa-icon icon="paper-plane"></fa-icon></button>
        </form>
        
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
    name:"ChatLog",
    data() {
        return {
            newMessage: ''
        }
    },
    watch: {
        'messages': function() {
            this.$emit('new-message')
        }
    },
    updated() {
        this.scrollBottom()
    },
    computed: {
        ...mapState(['messages', 'myid']),
    },
    methods: {
        formatDate(unixtimestamp) {
            return dayjs(unixtimestamp).format('hh:mm a')
        },
        sendMessage($event) {
            $event.preventDefault()
            if(this.newMessage) this.$socket.emit('message', this.newMessage)
            this.newMessage = ''
            this.$refs.sendbox.focus()
        },
        scrollBottom() {
            console.log("Scroll to Bottom")
            this.$refs.msglist.scrollTop = this.$refs.msglist.scrollHeight
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.chat-log {
    background: linear-gradient(90deg, $orchid, $yellow);
    max-width: 700px;
    padding:0.2em;
    margin:0 auto;
    max-height: 70vh;

    display: grid;
    grid-template-rows: 1fr auto;
    overflow:hidden;

    ul.messages {
        list-style: none;
        padding:0;margin:0;
        padding:1em;
        padding-bottom:0;
        background:$thirdary;
        width:100%;
        height:100%;
        overflow-y:auto;
        overflow-x:hidden;

        li {
            position: relative;
            margin:0.4em 2.6em;
            margin-top:1.8em;
            padding:0.4em;

            display: flex;
            align-items: center;
            justify-content: flex-start;

            &.server {
                margin-top:0.4em;
            }

            .server-msg {
                width:100%;
                text-align: center;
                opacity: 0.6;
                font-size:0.6em;
            }

            .ball {
                width:2em;
                height:2em;
                border-radius: 2em;
                display: flex;
                align-items: center;
                justify-content: center;

                position: absolute;
                top:0;
                right:100%;
                margin:0em 0.3em;
                margin-top:0.4em;
            }

            .meta {
                position: absolute;
                bottom:100%;
                left:0;
                padding:0em 1em;
                opacity: 0.6;
                font-size:0.6em;
            }
            
            .msg {
                background:$orchid;
                width:max-content;
                max-width: 100%;
                overflow:hidden;
                font-size: 1em;
                padding:0.4em 0.8em;
                border-radius: 1em;

                .content {
                    word-wrap: break-word;
                }
            }

            &.own {
                justify-content: flex-end;
                .ball {
                    right:auto;
                    left:100%;
                }
                .meta { 
                    left:auto;
                    right:0;
                }
                .msg {
                    background:$yellow;
                    color:black;
                }
            }
        }
    }

    .send {
        background:$thirdary;
        display: flex;
        padding:0.6em 0.4em;
        width:100%;
        overflow:hidden;

        input {
            background:$secondary;
            font:inherit;
            font-size:1em;
            flex: 1 1 1;
            border:none;
            border-radius: 2em;
            margin:0em 0.4em;
            padding:0.4em 1em;
            color:white;
            min-width: 0;
            width:100%;

            &:focus {
                outline:none;
                box-shadow: 0px 0px 1px 2px rgba($text, 0.5);
            }
        }

        button {
            @include button-reset;
            background:$orchid;
            border-radius: 2em;
            width:3em;
        }
    }
}

</style>