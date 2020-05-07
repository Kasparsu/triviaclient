<template>
    <ul>
        <li v-for="player in players"><player :player="player"></player></li>
    </ul>
</template>

<script>
    import Player from "./Player";
    export default {
        name: "PlayerList",
        components: {Player},
        props: ['players']
    }
</script>

<style scoped>

</style>