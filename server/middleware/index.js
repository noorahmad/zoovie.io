const Content = require('../models/content')
const Comment = require('../models/comment')
// middleware belongs here
const middlewareObj = {

}

middlewareObj.checkContentOwnership = function checkContentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
      Content.findById(req.params.id, (err, foundContent) => {
        if (err) {
          res.redirect('back')
        } else {
          //does user own the content
          if (foundContent.author.id.equals(req.user._id)) {
            next()
          } else {
            res.redirect('back')
          }
        }
      })
    } else {
      res.redirect('back')
    }
  }

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back')
      } else {
        //does user own the comment
        if (foundComment.author.id.equals(req.user._id)) {
          next()
        } else {
          res.redirect('back')
        }
      }
    })
  } else {
    res.redirect('back')
  }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = middlewareObj
