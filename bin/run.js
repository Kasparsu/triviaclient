const express = require('express');
const app = express();
const port = 3000;
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('dist'));
app.get('/game', (req, res) => res.render('game'));

app.get('/join', (req, res) => res.render('play'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));