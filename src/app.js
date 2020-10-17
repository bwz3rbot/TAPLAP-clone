const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const mongo = require('./config/mongo');
mongo.connect();
const thread = require('./util/threadStreamGenerator');
mongo.db.once('open', async () => {
    console.log("successfully connected to mongodb".green);
    await thread.streamUnreads();
});