<template>
    <main>
        <h2>Emergency Meeting</h2>
        <death-flyover cause="murder"></death-flyover>
        <ul>
            <li
                v-for="player in room.players"
                :key="player.id"
                @click="voteFor(player)"
                :class="{'can-vote': canVote(player), dead: player.alive === false}"
            >
                <fa-icon :icon="playerIcon(player)" :style="{color:player.colour}"></fa-icon>
                <span>&nbsp;{{player.username}} </span>
                <span v-if="lastElection && electionResults(player.id)">
                    <span
                        v-for="playerid in electionResults(player.id)"
                        :key="playerid"
                        class="ball"
                        :style="{backgroundColor: getPlayerById(playerid) ? getPlayerById(playerid).colour : '#000000'}"
                    ></span>
                </span>
                <fa-icon v-if="meeting && meeting.caller === player.id" class="caller" icon="bullhorn"></fa-icon>
            </li>
        </ul>
        <button v-if="alive" class="abstain" @click="voteFor()">
            <fa-icon :icon="vote === undefined ? 'check-circle' : 'circle'"></fa-icon> Abstain
            <span v-if="lastElection && electionResults('abstain')" :class="{'can-vote': vote === false && alive }">
                <span
                    v-for="playerid in electionResults('abstain')"
                    :key="playerid"
                    class="ball"
                    :style="{backgroundColor: getPlayerById(playerid) ? getPlayerById(playerid).colour : '#000000'}"
                ></span>
            </span>
        </button>
        <div v-if="seconds >= 0" class="countdown">Time Left {{seconds}}s</div>
        <div v-else class="countdown">Meeting Concluded</div>
    </main>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import DeathFlyover from '../components/DeathFlyover'

export default {
    name: "Meeting",
    components: {
        DeathFlyover,
    },
    data() {
        return {
            vote: false,
            seconds: 0,
        }
    },
    mounted() {
        console.log("Meeting: ", this.meeting)
        if(typeof this.meeting === 'object' && this.meeting.countdown !== undefined && !isNaN(this.meeting.countdown)) {
            this.seconds = +this.meeting.countdown / 1000;
            this.countDown()
        }
    },
    computed: {
        ...mapState(['meeting', 'room', 'alive', 'lastElection']),
        ...mapGetters(['getPlayerById']),
    },
    methods: {
        voteFor(victim) {
            if(victim === undefined) {
                this.vote = victim;
                this.$socket.emit('castVote')
            } else if(this.canVote(victim)) {
                this.vote = victim.id;
                this.$socket.emit('castVote', victim.id)
                console.log("I voted :)")
            }
        },
        canVote(player) {
            return this.vote === false && this.alive && player.alive === true;            
        },
        countDown() {
            if(this.seconds > 0 && this.lastElection === null) {
                setTimeout(() => {
                    this.seconds -= 1;
                    this.countDown();
                }, 1000)
            } else {
                this.seconds = -1;
            }
        },
        electionResults(playerid) {
            if(this.lastElection) {
                return this.lastElection.candidates[playerid];
            } else {
                return [];
            }
        },
        playerIcon(player) {
            if(player.alive === false) return 'skull'
            if(this.vote === player.id) return 'check-circle'
            return 'circle'
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

main {
    @include main-container;
}

h2 {
    width:100%;
    margin:0;
    text-align: center;
    letter-spacing: 0.1em;
}

ul {
    list-style: none;
    padding:0;margin:0;

    padding-top:1em;

    li {
        width:100%;
        background:$thirdary;
        margin-bottom:0.6em;
        padding:0.4em 0.6em;
        border-radius: 2em;
        font-size:1.4em;
        position: relative;

        &.can-vote {
            cursor: pointer;

            &:hover {
                background:$secondary;
            }
        }

        &:not(.can-vote) {
            opacity: 0.7;
        }

        .caller {
            position: absolute;
            top:50%;
            right:1em;
            transform:translateY(-50%);
            opacity: 0.5;
        }
    }
}

button.abstain {
    width:100%;
    background:$thirdary;
    color:$text;
    border:none;
    font-size:1rem;
    padding:0.4em 0.6em;
    border-radius: 2em;
    text-align: left;
    margin-top:1em;
    font-size:1.4em;
    cursor: pointer;

    &:hover {
        background:$secondary;
    }

}

.countdown {
    padding:1em;
    font-size:2em;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
}

.ball {
    height:0.8em;
    width:0.8em;
    display:inline-block;
    border-radius: 1em;
    margin-right:0.2em;
}

</style>