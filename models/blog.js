const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Blog', blogSchema)