<template>
    <div class="container">
        <div v-if="!joined">
            <input class="input" type="text" placeholder="code" v-model="code">
            <input class="input" type="text" placeholder="name" v-model="name">
            <button class="button" @click="join">Join</button>
        </div>
        <div v-if="started">
            Game Has Started
            <h1 v-if="timer">{{timer}}</h1>
            <div class="columns" v-if="options.length">
                <div class="column is-one-quarter" v-for="(option, index) in options" :key="index">
                    <button class="button" v-html="option" @click="answer(option)"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Play",
        created() {
            this.ws = new WebSocket('ws://localhost:8080');
            this.ws.onmessage = (event) => {
                let msg = JSON.parse(event.data);
                if(msg.action === 'uid'){
                    this.uid = msg.data.uid;
                    this.joined = true;
                }
                if(msg.action === 'start'){
                    this.started = true;
                    this.options = msg.data.options;
                    this.timer = 30;
                }
                if(msg.action === 'timeout'){
                    this.timer--;
                }
            };
        },
        data(){
            return {
                code: '',
                name: '',
                ws: null,
                joined: false,
                uid: null,
                started: false,
                options: [],
                timer: 0
            }
        },
        methods: {
            join(){
                this.ws.send(JSON.stringify({
                    sender: 'player',
                    action: 'join',
                    data: {
                        name: this.name,
                        code: this.code
                    }
                }));
            },
            answer(option){
                this.ws.send(JSON.stringify({sender:'player', id: this.uid, action:'answer', data: {answer: option}}));
                this.options = [];
            }
        }
    }
</script>

<style scoped>

</style>