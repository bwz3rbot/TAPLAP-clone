const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/userdata', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
const db = mongoose.connection
db.on('error', function (err) {
    console.log('connection error:', err);
    console.log("Is the database running?");
    process.exit();
});
db.once('open', function () {
    console.log("connected to mongodb")
});

const Schema = mongoose.Schema;

const UserReviewTable = new Schema({
    username: String,
    reviews: Array
});

const UserReviewModel = mongoose.model('UserReviewsTable', UserReviewTable);


module.exports = {
    UserReviewModel
}