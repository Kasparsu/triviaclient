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
                <div class="column is-one-quarter" v-for="option in options">
                    <button class="button" v-html="option" @click="answer(option)"></button>
                </div>
            </div>
            <h2 v-if="availableHintsCount">Available hints</h2>
            <div class="columns">
                <div class="column is-one-quarter" v-for="hint of hints">
                    <button class="button" v-if="hint.available" @click="getHint(hint)">{{hint.name}}</button>
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
                if(msg.action === 'hint') {
                    if(msg.data.type === 'fiftyFifty') {
                        this.options = msg.data.options;
                    }
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
                timer: 0,
                hints: {
                    fiftyFifty: {
                        type: 'fiftyFifty',
                        available: true,
                        name: 'Fifty Fifty'
                    },
                }
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
            },
            getHint(hint) {
                if(hint.available) {
                    this.ws.send(JSON.stringify({sender:'player', id: this.uid, action:'getHint', data: {type: hint.type}}));
                    hint.available = false;
                }
            }
        },
        computed: {
            availableHintsCount() {
                // Object.values(this.hints).filter(hint => hint.available).length
                return Object.values(this.hints).reduce((count, item) => count + (item.available ? 1 : 0), 0);
            }
        }
    }
</script>

<style scoped>

</style>