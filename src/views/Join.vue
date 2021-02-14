<template>
    <main>
        <nav>
            <h2 class="item" 
                :class="{active: mode == 'join' || mode == 'scan'}"
                @click="mode = 'join'"
            >Join Room</h2>
            <h2 class="item" 
                :class="{active: mode == 'create'}"
                @click="mode = 'create'"
            >Create Room</h2>
        </nav>
        <section v-show="mode == 'join'" class="join">
            <div class="form-row">
                <label>Roomcode</label>
                <div class="roomcode">
                    <input type="text" v-model="roomcode" style="text-transform:uppercase">
                    <button class="scan" @click="mode = 'scan'">
                        <fa-icon icon="barcode-read"></fa-icon>
                    </button>
                </div>
            </div>
            <div class="form-row">
                <label>Username</label>
                <input type="text" v-model="username" style="text-transform:uppercase" maxlength="16">
            </div>
            <div class="form-row">
                <button @click="join">Join</button>
            </div>
        </section>
        <section v-show="mode == 'create'" class="create">
            <div class="form-row">
                <label>Username</label>
                <input type="text" v-model="username" style="text-transform:uppercase" maxlength="16">
            </div>
            <div class="form-row">
                <button @click="createRoom">Create</button>
            </div>
        </section>
        <section v-if="mode == 'scan'">
            <div class="camera">
                <div v-show="loadingCamera || qrerror" class="camera-message">
                    {{qrerror || 'Loading...'}}
                </div>
                <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
            </div>
            <div class="form-row">
                <button class="back" @click="mode = 'join'">Back</button>
            </div>
        </section>
    </main>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
    name: "Join",
    components: {
        QrcodeStream
    },
    data() {
        return {
            roomcode: '',
            username: '',
            mode: 'join',
            qrerror: '',
            loadingCamera: false
        }
    },
    methods: {
        join() {
            this.$socket.emit('joinRoom', this.username.toUpperCase(), this.roomcode.replace(/ /g, '').toUpperCase())
        },
        createRoom() {
            this.$socket.emit('createRoom', this.username.toUpperCase())
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
        onDecode(result) {
            const [moidah, func, arg] = result.split(':')
            if(moidah == 'moidah' && func == 'room') {
                this.roomcode = arg;
                this.mode = 'join'
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import '../style/variables';

main {
    max-width: $max-width;
    margin: 0 auto;
    padding:1em;

    nav {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-bottom:1em;

        h2 {
            opacity: 0.6;
            margin:0;
            position: relative;
            cursor: pointer;
            text-align: center;

            &::after {
                content:'';
                height:0.1em;
                width:100%;
                background:linear-gradient(90deg, $orchid, $yellow);

                position: absolute;
                top:100%;
                left:0;

                opacity: 0;
            }

            &.active {
                opacity: 1;

                &::after {
                    opacity: 1;
                }
            }

            &:not(.active) {

                &:hover {
                    opacity: 0.8;

                    &::after {
                        opacity: 0.6;
                    }
                }
            }
        }
    }

    .form-row {
        display: flex;
        flex-direction: column;
        margin-bottom:1em;

        label {
            font-size:1.2em;
            margin-bottom:0.2em;
            padding:0em 0.6em;
        }

        .roomcode {
            display: flex;
            
            input {
                flex-grow:1;
            }
        }

        input {
            background:none;
            color:$text;
            font-size:1rem;
            padding:0.4em 1em;
            position: relative;
            border:0.2em solid white;
            border-radius: 2em;
            font-size:1.2em;

            &:focus {
                outline:none;
                box-shadow: 0px 0px 1px 2px rgba($text, 0.5);
            }
        }

        button {
            font-size:1.4em;
            background: linear-gradient(90deg, $orchid, $yellow);
            border:none;
            color:$text;
            border-radius: 2em;
            padding:0.4em;

            &.scan {
                width:2em;
                background:transparent;
            }

            &.back {
                background:$thirdary;
            }
        }
    }

    .camera {
        padding:0.1em;
        background:linear-gradient(90deg, $orchid, $yellow);
        position: relative;
        margin-bottom:1em;
        border-radius: 1em;

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

        > .wrapper {
            border-radius: 1em;
            overflow: hidden;
        }
    }
}

</style>