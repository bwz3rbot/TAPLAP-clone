const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const thread = require('./util/threadStreamGenerator')
thread.streamUnreads();

const WikiEditor = require('./service/Wiki/WikiEditor')
WikiEditor.run();