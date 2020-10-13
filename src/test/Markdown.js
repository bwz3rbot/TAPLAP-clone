const {
    Markdown
} = require('../util/SnooMD');
const md = new Markdown();

// Basic Markdown
const MarkdownString =
    `Hello There! ${md.apply("Bolded Text!", md.bold)}\n
This will be ${md.superscript("SUPERSCRIPTED!")}\n
Here is a fancy codeblock:\n
${md.apply('console.log(markdown)',md.codeblock)}\n
Here is a named link: ${md.link("https://www.google.com","search")}\n
Here is some fenced text: \n${md.fence("Fenced text here for ya")}`

// Tables
const row1 = {
    rating: "5",
    type: "Trade",
    comments: "https://www.reddit.com/r/TakeaPlantLeaveagewagewgaewgafgads/g6j7nix?utm_source=share&utm_medium=web2x&context=3"
}
const row2 = {
    rating: "2",
    type: "Giveaway",
    comments: `https://www.reddit.com/r/Takea"Plant"Leaveafewgawerew"rfreview_thread_july_september_2020/g6j7nix?utm_source=share&utm_medium=web2x&context=3`
}
const row3 = {
    rating: "1",
    type: "Sale",
    comments: "https://www.reddit.com/r/TakeaPlantLeaveaPlant/coafefaefaewfaad_july_september_2020/g6j7nix?utm_source=share&utm_medium=web2x&context=3"
}
const t = md.table(["Rating", "Type", "Comments"], [row1,row2,row3])

//  Links
const link1 = md.link(row1.comments, "My link")
const link2 = md.link(row2.comments,"Named link")
