import Vue from 'vue';
import Play from './pages/player/Play.vue';
import 'bulma';
new Vue({ render: createElement => createElement(Play) }).$mount('#app');