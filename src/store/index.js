import Vue from 'vue'
import Vuex from 'vuex'

import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        room: null,
        myid: null,
        tasks: {},
        role: '',
        alive: true,
        progress: 0,
        meeting: null,
        victory: null,
        introduced: false,
        error:'',
        lastDeath: null,
        lastElection: null,
        messages:[]
    },
    getters: {
        getPlayerById: (state) => (id) => {
            return state.room ? state.room.players.find(player => player.id === id) : null
        },
        isLeader: (state) => {
            return state.room && state.myid && state.room.owner === state.myid
        }
    },
    mutations: {
        setRoom(state, room) {
            state.room = room
        },
        setMyid(state, id) {
            state.myid = id
        },
        clearRoom(state) {
            state.room = null
            state.messages = []
        },
        setTasks(state, tasks) {
            state.tasks = tasks
        },
        setRole(state, role) {
            state.role = role
            state.alive = true
        },
        finishTask(state, task) {
            if(state.tasks[task] !== undefined) state.tasks[task] = true
        },
        setProgress(state, progress) {
            state.progress = progress
        },
        setMeeting(state, { type, caller, victim, countdown }) {
            state.meeting = { type, caller, victim, countdown }
            if(victim && state.room) {
                const deceased = state.room.players.find(player => player.id === victim)
                if(deceased) {
                    deceased.alive = false
                    state.lastDeath = deceased
                }
            } else {
                state.lastDeath = null
            }
            router.push({ name: 'Meeting' });
        },
        endMeeting(state, { election, ejected }) {
            state.meeting = null;
            if(ejected && state.room) {
                if(ejected.id === state.myid) state.alive = false
                const localEjected = state.room.players.find(player => player.id === ejected.id)
                if(localEjected) {
                    localEjected.alive = false;
                    state.lastDeath = localEjected
                }
            } else {
                // Abstained
                state.lastDeath = null
            }
            state.lastElection = election;
            setTimeout(() => {
                router.push({ name: 'Game' })
                state.lastElection = null;
            }, 5000);
        },
        setVictory(state, victorious) {
            state.victory = victorious
            state.role = ''
            state.alive = true;
            if(victorious) router.push({ name: 'Victory' })
        },
        getMurdered(state) {
            state.alive = false;
            if(state.room && state.myid) {
                const you = state.room.players.find(player => player.id === state.myid)
                if(you) you.alive = false
            }
        },
        setIntroduced(state, introduced) {
            state.introduced = introduced;
        },
        setError(state, error) {
            state.error = error;
        },
        addMessage(state, message) {
            state.messages = [...state.messages, message];
        },
        addServerMessage(state, message) {
            state.messages = [...state.messages, { server: message, timestamp: Date.now() }]
        },
        clearMessages(state) {
            state.messages = []
        }
    },
    actions: {
        SOCKET_room: ({ commit }, room) => {
            commit('setRoom', room)
        },
        SOCKET_joinedRoom: ({ commit }, { room, user }) => {
            commit('setRoom', room)
            commit('setMyid', user.id)
            router.push({ name: 'Lobby' })
            localStorage.setItem('globalid', user.globalid);
            localStorage.setItem('roomid', room.id);
            commit('clearMessages');
            commit('addServerMessage', 'Joined Game');
        },
        SOCKET_noRoom: ({ commit }) => {
            commit('clearRoom')
            router.push({ name: 'Join' }).catch(() => {})
            commit('setError', 'No Room Found')
            localStorage.removeItem('globalid')
            localStorage.removeItem('roomid')
        },
        SOCKET_serverMsg: (store, msg) => {
            console.log(`[SERVER] ${msg}`)
        },
        SOCKET_roomReady: ({ state, commit }, players) => {
            const you = players.find(player => player.id === state.myid)
            if(you) {
                commit('setTasks', you.tasks)
                commit('setRole', you.role)
                commit('setProgress', 0)
                router.push({ name: 'Game' })
                commit('addServerMessage', 'Game Started');
            }
        },
        SOCKET_taskCompletion: ({ commit }, percentage) => {
            commit('setProgress', percentage)
        },
        SOCKET_meeting: ({ commit, getters }, meeting) => {
            commit('setMeeting', meeting)
            const caller = getters.getPlayerById(meeting.caller)
            commit('addServerMessage', `Meeting Called By ${caller ? caller.username : 'Unknown'}`);
        },
        SOCKET_voteEnd: ({ commit }, electionResult) => {
            commit('endMeeting', electionResult)
            commit('addServerMessage', electionResult.ejected ? `${electionResult.ejected} was executed` : 'Nobody was executed');
        },
        SOCKET_victory: ({ commit }, victory) => {
            commit('setVictory', victory)
            commit('addServerMessage', `Game Over: ${victory} Won`);
        },
        SOCKET_message: ({ state, commit }, message) => {
            if(state.role === '' || state.alive === false) {
                commit('addMessage', message);
            }
        }
    }
})
