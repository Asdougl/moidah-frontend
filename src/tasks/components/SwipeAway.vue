<template>
    <component :is="tag || 'div'" class="swipe-away" ref="swiper"
        @touchstart="swipeStart"
        @mousedown="swipeStartMouse"
        @touchmove="swipeMove"
        @mousemove="swipeMoveMouse"
    >
        <slot></slot>
    </component>
</template>

<script>
export default {
    name:"SwipeAway",
    props: ['tag'],
    data() {
        return {
            xDown: null,
            yDown: null,
        }
    },
    methods: {
        swipeStart($event) {
            this.xDown = $event.touches[0].clientX
            this.yDown = $event.touches[0].clientY
        },
        swipeStartMouse($event) {
            this.xDown = $event.clientX
            this.yDown = $event.clientY
        },
        swipeMove($event) {
            if(!this.xDown || !this.yDown) {
                return;
            }

            const xUp = $event.touches[0].clientX
            const yUp = $event.touches[0].clientY

            const xDiff = this.xDown - xUp
            const yDiff = this.yDown - yUp

            if(Math.abs(xDiff) > 70 && Math.abs(xDiff) > Math.abs(yDiff)) {
                this.$emit('remove');
            }

        },
        swipeMoveMouse($event) {
            if(!this.xDown || !this.yDown) {
                return;
            }

            const xUp = $event.clientX
            const yUp = $event.clientY

            const xDiff = this.xDown - xUp
            const yDiff = this.yDown - yUp

            if(Math.abs(xDiff) > 70 && Math.abs(xDiff) > Math.abs(yDiff)) {
                this.$emit('remove');
            }
        },
    }
}
</script>

<style>

</style>