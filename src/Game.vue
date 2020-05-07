<template>
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
            };
        },
        data(){
            return {
                players: [],
                code: '',
                uid: '',
                ws: null,
                started: false
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