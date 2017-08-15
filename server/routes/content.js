const express = require('express')
const router = express.Router()
const Content = require('../models/content')

//index route
router.get('/', (req, res) => {
  //Get all content from DB
  Content.find({}, (err, allcontent) => {
    if (err) {
      console.log(err)
    } else {
      res.render('content/index', {content: allcontent, currentUser: req.user})
    }
  })
})

//NEW - create
router.post('/', isLoggedIn, (req, res) => {
  const name = req.body.name
  const media = req.body.media
  const desc = req.body.description
  const author = {
    id: req.user._id,
    username: req.user.username
  }
  const newContent = {name: name, media: media, description: desc, author: author}
  Content.create(newContent, (err, newlyCreated) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/content')
    }
  })
})

//NEW - show
router.get('/new', isLoggedIn, (req, res) => {
  res.render('content/new.ejs')
})

//Show
router.get('/:id', (req, res) => {
  Content.findById(req.params.id).populate('comments').exec( (err, foundContent) => {
    if (err) {
      console.log(err)
    } else {
      res.render('content/show', {content: foundContent})
    }
  })
})

//Edit content route
router.get('/:id/edit', (req, res) => {
  //is user logged in?
  if (req.isAuthenticated()) {
    Content.findById(req.params.id, (err, foundContent) => {
      if (err) {
        res.redirect('/content')
      } else {
        res.render('content/edit', {content: foundContent})
      }
    })
  } else {
    console.log("You must log in to do that")
    res.send('You need to log in to continue')
  }
})

router.put('/:id', (req, res) => {
  //find and update correct conten
  Content.findByIdAndUpdate(req.params.id, req.body.content, (err, updateContent) => {
    if (err) {
      res.redirect('/content')
    } else {
      //redirect somewhere (show page)
      res.redirect('/content/' + req.params.id)
    }
  })
})

//DELETE
router.delete('/:id', (req, res) => {
  Content.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/content')
    } else {
      res.redirect('/content')
    }
  })
})

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = router
