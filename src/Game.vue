<template>
    <div>
        <div class="container column is-half" v-if="!started">
            <div class="columns">
                <div class="column is-size-3">Join Code is {{code}}</div>
                <div class="column is-one-fifth">
                    <player-list :players="players"></player-list>
                </div>
            </div>
            <button class="button is-success" @click="start">Start</button>
        </div>

        <div class="container has-text-centered" v-if="question">
            <h1 class="is-size-2" v-html="question"></h1>
            <h1 v-if="timer" class="is-size-3">{{timer}}</h1>
        </div>

        <div v-if="showCorrectAnswer" class="container">
            <h2 class="is-size-2 has-text-centered">Correct answer: <span class="has-text-success">{{correctAnswer}}</span></h2>
        </div>

        <div class="container" id="score" v-if="score.length">
            <ul>
                <li class="is-size-4 has-text-centered" v-for="(points, index) in score" :key="index">{{points.name}} - {{points.score}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
    import PlayerList from "./components/PlayerList";
    export default {
        components: {PlayerList},
        created() {
            this.ws = new WebSocket('ws://localhost:8080');
            this.ws.onopen = (event) => {
                this.ws.send(JSON.stringify({sender:'game', action:'getCode'}));
            };
            this.ws.onmessage = (event) => {
                let msg = JSON.parse(event.data);
                console.log(msg);
                if(msg.action === 'code'){
                    this.code = msg.data.code;
                }
                if(msg.action === 'playerJoined'){
                    this.players.push(msg.data.name);
                }
                if(msg.action === 'uid'){
                    this.uid = msg.data.uid;
                }
                if(msg.action === 'question'){
                    this.showCorrectAnswer = false
                    this.correctAnswer = null
                    this.question = msg.data.question;
                    this.speak(msg.data.question)
                    this.timer = 30;
                }
                if(msg.action === 'timeout'){
                    this.timer--;
                }
                if(msg.action === 'score'){
                    this.question = '';
                    this.score = msg.data.score;
                    this.correctAnswer = msg.data.correctAnswer
                    this.showCorrectAnswer = true
                }
            };
        },
        data(){
            return {
                players: [],
                code: '',
                uid: '',
                ws: null,
                started: false,
                question: null,
                timer: 0,
                score: [],
                correctAnswer: null,
                showCorrectAnswer: false                
            }
        },
        methods: {
            start(){
                this.ws.send(JSON.stringify({sender: 'game', action:'start', id: this.uid}));
                this.started = true;
            },
            speak(text) {                
                var msg = new SpeechSynthesisUtterance(text)  
                window.speechSynthesis.speak(msg)
            }
        }
    }
</script>

<style scoped>
#score {
    margin-top: 69px;
}
</style>