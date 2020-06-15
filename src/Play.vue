<template>
    <div>
        <button v-on:click="switchDarkTheme()">{{ darkThemeText }}</button>
        <div v-if="!joined">
            <input class="input" type="text" placeholder="code" v-model="code">
            <input class="input" type="text" placeholder="name" v-model="name">
            <button class="button" @click="join">Join</button>
        </div>
        <div v-if="started">
            <h1>Game Has Started</h1>
            <h1 v-if="timer">{{timer}}</h1>
            <div class="columns" v-if="options.length">
                <div class="column is-one-quarter" v-for="option in options">
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
                timer: 0,
                darkThemeText: 'Dark theme',
                isDarkTheme: false
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
            switchDarkTheme() {
                const body = document.body;
                this.isDarkTheme = !this.isDarkTheme

                if (this.isDarkTheme) {
                    body.classList.add('dark-theme');
                } else {
                    body.classList.remove('dark-theme');
                }
            }
        }
    }
</script>

<style scoped>
    .dark-theme.container {
        background-color: #000;
    }
</style>