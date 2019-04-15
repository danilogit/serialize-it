const mongoose = require('mongoose');

mongoose.connect('mongodb://mongodb/serialize-it', {useNewUrlParser: true})
.then(() => {
    console.log("Connected to MongoDB.")
});