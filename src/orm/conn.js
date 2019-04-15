const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/serialize-it', {useNewUrlParser: true})
.then(() => {
    console.log("Connected to MongoDB.")
});