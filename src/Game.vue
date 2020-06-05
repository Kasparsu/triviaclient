<template>
    <div >

    <div class="container" v-if="!started">
        <div class="columns">
            <div class="column">
                Join Code is {{code}}
            </div>
            <div class="column is-one-fifth">
                <player-list :players="players"></player-list>
            </div>
        </div>
        <h1 class="is-size-3" v-if="!categories">Loading...</h1>
        <p v-if="categories">Please select a category:</p>
        <div class="is-inline" v-for="category in categories">
            <button @click="start(category.id)" :id="category.id">{{category.name}}</button>
        </div>
        <br>
        <button class="is-size-4" v-if="categories" @click="start('random')">Random</button>

    </div>
        <div class="container" v-if="question">
            <h1 class="is-size-1" v-html="question"></h1>
            <h1 v-if="timer">{{timer}}</h1>
        </div>
        <div class="container" v-if="score.length">
            <ul>
                <li v-for="points in score">{{points.name}} - {{points.score}}</li>
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
                if(msg.action === 'categories'){
                    this.categories = msg.data.trivia_categories;
                }
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
                    this.question = msg.data.question;
                    this.timer = 30;
                }
                if(msg.action === 'timeout'){
                    this.timer--;
                }
                if(msg.action === 'score'){
                    this.question = '';
                    this.score = msg.data.score;
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
                categories: null
            }
        },
        methods: {
            start(category){
                if(category === 'random'){
                    category = this.categories[Math.floor(Math.random() * this.categories.length)].id;
                }
                this.ws.send(JSON.stringify({sender: 'game', action:'start', category: category, id: this.uid}));
                this.started = true;
            }
        }
    }
</script>