const
    colors = require('colors'),
    EventEmitter = require('events'),
    dateFormat = require('dateformat'),
    snoowrap = require('../config/snoo-config').streamRequester,
    actionRequester = require('../config/snoo-config').actionRequester,
    BotService = require('../service/BotService'),
    timeout = 20000,
    logging = JSON.parse(process.env.DEBUG_CODE) || false,
    limit = process.env.LIMIT;

// [Mention Emitter Class (extends EventEmitter)]
class CommentEmitter extends EventEmitter {
    constructor(supply) {
        super();
    }
    comment(comment) {
        this.emit("comment", comment)
        if (listing.length = 0) {
            throw Error(`no new comments received!`)
        }
    }
}
const commentEmitter = new CommentEmitter()

// 1. [Get Inbox]
let previousCommentUTC;
const getSubmission = function () {
    if (logging) {
        console.log('initializing the stream...'.magenta)
    }

    console.log("Getting thread with id: ", process.env.THREAD_ID)
    return snoowrap.getSubmission(process.env.THREAD_ID)
        .setSuggestedSort('new')
        .fetch();
}

// 2. [Assign First UTC]
const assignFirstUTC = function (thread) {
    console.log("assigning the first")
    previousCommentUTC = parseInt(thread.comments[0].created_utc)
    let count = 0;
    thread.comments.forEach(comment => {
        if (count <= parseInt(limit)) {
            commentEmitter.emit('comment', comment)
        }
        count++
    })
}

// 3. [Stream In Mentions]]
const streamInComments = function () {

    // 3.a) Checks inbox at an interval of 20 seconds
    setInterval(() => {
        if (logging) {
            console.log("checking again...")
        }

        snoowrap.getSubmission(process.env.THREAD_ID)
            .setSuggestedSort('new')
            .fetch().then((submission) => {


                // 3.b) If a new item exists in the listing,
                submission.comments.forEach(comment => {
                    let created = comment.created_utc
                    if (created > previousCommentUTC) {
                        commentEmitter.emit('comment', comment)
                    }
                })
                previousCommentUTC = parseInt(submission.comments[0].created_utc)

            })
    }, timeout)
}

// [Run Once Indefinately] Checks the Messaging Queue For new items, processes them.
const newItems = [] // Messaging queue items are pushed into this array
const runOnceIndefinately = function () {
    if (logging) {
        console.log('NUMBER OF ITEMS IN THE QUEUE: ' + newItems.length)
    }

    if (newItems[0] != undefined) {
        // If item exists, it is popped out of the array and handled by the BotService
        newItem = newItems.pop()
        return actionRequester.getComment(newItem.id).fetch()
            .then((item) => {

                // BOT SERVICE CODE RUNS HERE!!
                BotService.doSomething(item)
                    .then(runOnceIndefinately)

            })
    } else {
        if (logging) {
            formattedDate = dateFormat(Date.now())
            console.log(formattedDate + `|  there are no items left in the queue! checking again in ${timeout} seconds...`.magenta)
        }

        setTimeout(() => {
            runOnceIndefinately()
        }, timeout)
    }

}


// Main Loop of the stream.
const streamUnreads = function () {
    getSubmission()
        .then(assignFirstUTC)
        .then(streamInComments)
}

// 4. On Item Being Emitted, push the item into an array.
commentEmitter.on("comment", (item) => {
    newItems.push(item)
    if (logging) {
        console.log(`New Item received!: ${dateFormat(Date.now())}`.yellow)
    }
})

// Startup Message
commentEmitter.once("comment", () => {
    console.log(`Please wait while I check the last ${limit} comments that may have been missed while I was offline...`.bgBlack.yellow)
})

// Messaging Queue Popper
commentEmitter.once("comment", () => {
    runOnceIndefinately();
})

module.exports = {
    streamUnreads: streamUnreads
}