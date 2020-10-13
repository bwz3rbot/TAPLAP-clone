const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const mongo = require('./config/mongo');
(async () => {
    await mongo.connect();
})();

const thread = require('./util/threadStreamGenerator');
thread.streamUnreads();

const WikiEditor = require('./service/Wiki/WikiEditor');
WikiEditor.run();