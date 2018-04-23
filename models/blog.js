const mongoose = require('mongoose')
const Comment = require('./comment')
const Schema = mongoose.Schema

const BlogSchema = new Schema({
    title : String,
    image : String,
    body : String,
    created : {
        type: Date,
        default : Date.now
    },
    comments : [{
        type : Schema.Types.ObjectId,
        ref : "Comment"
    }]
})

module.exports = mongoose.model("Blog", BlogSchema)