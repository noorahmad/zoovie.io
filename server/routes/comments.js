const express = require('express')
const router = express.Router({mergeParams: true})
const Content = require('../models/content')
const Comment = require('../models/comment')

//Comments - new
router.get('/new', isLoggedIn, (req, res) => {
  Content.findById(req.params.id, (err, content) => {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', {content: content})
    }
  })
})

//Comments - create
router.post('/', isLoggedIn, (req, res) => {
  Content.findById(req.params.id, (err, content) => {
    if (err) {
      console.log(err)
      res.redirect('/content')
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err)
        } else {
          //add username and id to comment
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          //save comment
          comment.save()
          content.comments.push(comment)
          content.save()
          res.redirect('/content/' + content._id)
        }
      })
    }
  })
})

//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = router
