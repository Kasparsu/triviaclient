import Vue from 'vue';
import Game from './pages/host/Game.vue';
import 'bulma';
new Vue({ render: createElement => createElement(Game) }).$mount('#app');