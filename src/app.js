const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const thread = require('./util/threadStreamGenerator');
const mongo = require('./config/mongo');
(async () => {
    await mongo.connect();
})();

mongo.db.once('open', async () => {
    console.log("successfully connected to mongodb".green);
    await thread.streamUnreads();
});