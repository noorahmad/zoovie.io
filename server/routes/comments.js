const express = require('express')
const router = express.Router({mergeParams: true})
const Content = require('../models/content')
const Comment = require('../models/comment')
const middleware = require('../middleware')

//Comments - new
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Content.findById(req.params.id, (err, content) => {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', {content: content})
    }
  })
})

//Comments - create
router.post('/', middleware.isLoggedIn, (req, res) => {
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

//edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect('back')
    } else {
      res.render('comments/edit', {content_id: req.params.id, comment: foundComment})
    }
  })
})

//update
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back')
    } else {
      res.redirect('/content/' + req.params.id)
    }
  })
})

//DELETE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back')
    } else {
      res.redirect('/content/' + req.params.id)
    }
  })
})

module.exports = router
