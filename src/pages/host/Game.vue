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
            <button @click="start">Start</button>
        </div>
        <div class="container" v-if="question && timer">
            <h1 class="game game__question is-size-1" v-html="question"></h1>
            <h1 class="game game__timer is-size-1" v-if="timer">{{timer}}</h1>
        </div>
        <div class="game game__players is-size-3" v-if="score.length && !question">
            <ul>
                <li v-for="points in score">
					{{points.name}} - {{points.score}}
				</li>
            </ul>
        </div>
		<div class="game game__players is-size-3" v-if="players && started && question">
            <ul>
                <li v-for="player in players">
					<div :class="{'game__players--answered': answeredPlayers.includes(player)}">
						{{player}}
					</div>
				</li>
            </ul>
        </div>
    </div>
</template>
<script>
    import PlayerList from "../../components/PlayerList";
    export default {
        components: {PlayerList},
        created() {
            this.ws = new WebSocket('ws://localhost:8080');
            this.ws.onopen = (event) => {
                this.ws.send(JSON.stringify({sender:'game', action:'getCode'}));
            };
            this.ws.onmessage = (event) => {
				let msg = JSON.parse(event.data);
				
				// console.log(this.players);
				if(msg.action !== 'timeout') {
					console.log(msg);
				}
                if(msg.action === 'code'){
                    this.code = msg.data.code;
                }
                if(msg.action === 'playerJoined'){
                    this.players.push(msg.data.name);
				}
				if(msg.action === 'playerAnswered'){
                    this.answeredPlayers.push(msg.data.name);
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
					this.answeredPlayers = [];
                }
            };
        },
        data(){
            return {
				players: [],
				answeredPlayers: [],
                code: '',
                uid: '',
                ws: null,
                started: false,
                question: null,
                timer: 0,
                score: []
            }
        },
        methods: {
            start(){
                this.ws.send(JSON.stringify({sender: 'game', action:'start', id: this.uid}));
				this.started = true;
            }
        }
    }
</script>
<style lang="scss">
.game {
	text-align: center;
	margin-top: 40px;

	&__players {
		text-align: unset;
		display: flex;
  		justify-content: center;

		&--answered {
			color: green;
		}

		&:not(:nth-child(1)) {
			margin-top: 5px;
		}
	}
}
</style>