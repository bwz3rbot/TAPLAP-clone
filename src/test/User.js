const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const mongo = require('../config/mongo');
(async () => {
    await mongo.connect();
})();
const User = require('../service/User/User');

(async () => {
    console.log("RUNNING TEST!")
    await User.runTest();
})();