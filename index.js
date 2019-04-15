const express = require('express');
const api = require('./src/routes/api');
const app = express();
const hbs = require('hbs');
const port = 4488;
const cors = require('cors');

require('./src/orm/conn');

app.use(cors());

app.set('view engine', 'hbs');
app.use('/api/v1', api);


app.use('/', express.static(__dirname + '/src/public/app/build'));
app.use('/*', function(req, resp, next) {
    resp.sendFile(__dirname + '/src/public/app/build/index.html');
});

app.listen(port, function() {
    console.log(`Listening ${port}`);
})