<template>
    <main>
        <input type="text" v-model="taskName">
        <task-controller
            :task="taskName.toLowerCase()" 
            @done="finTask"
            @close="taskName = ''"
        ></task-controller>
    </main>
</template>

<script>
import TaskController from '../components/TaskController'

export default {
    name: "TaskTest",
    components: {
        TaskController,
    },
    data() {
        return {
            taskName: ''
        }
    },
    methods: {
        finTask() {
            this.taskName = ''
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

main {
    @include main-container;
    display: grid;
    grid-template-rows: auto 1fr;
}

</style>