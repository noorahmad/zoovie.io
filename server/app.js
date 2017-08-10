const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Content = require('./models/content')
const Comment = require('./models/comment')
const seedDB = require('./seeds')

mongoose.connect('mongodb://noor:noor@ds137197.mlab.com:37197/zoovie')
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
seedDB()

app.get('/', (req, res) => {
  res.render('landing')
})


app.get('/content', (req, res) => {
  Content.find({}, (err, allcontent) => {
    if (err) {
      console.log(err)
    } else {
      res.render('content/index', {content: allcontent})
    }
  })
})

//NEW - create
app.post('/content', (req, res) => {
  const name = req.body.name
  const media = req.body.media
  const desc = req.body.description
  const newContent = {name: name, media: media, description: desc}
  Content.create(newContent, (err, newlyCreated) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/content')
    }
  })
})

//NEW - show
app.get('/content/new', (req, res) => {
  res.render('content/new.ejs')
})

app.get('/content/:id', (req, res) => {
  Content.findById(req.params.id).populate('comments').exec( (err, foundContent) => {
    if (err) {
      console.log(err)
    } else {
      console.log(foundContent)
      res.render('content/show', {content: foundContent})
    }
  })
})

//Comment Route
app.get('/content/:id/comments/new', (req, res) => {
  Content.findById(req.params.id, (err, content) => {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', {content: content})
    }
  })
})

app.post('/content/:id/comments', (req, res) => {
  Content.findById(req.params.id, (err, content) => {
    if (err) {
      console.log(err)
      res.redirect('/content')
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err)
        } else {
          content.comments.push(comment)
          content.save()
          res.redirect('/content/' + content._id)
        }
      })
    }
  })
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
