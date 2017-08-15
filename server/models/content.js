const mongoose = require('mongoose')

//Schema Setup
const contentSchema = new mongoose.Schema({
  name: String,
  media: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
})

module.exports = mongoose.model('Content', contentSchema)
