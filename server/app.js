const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const Content = require('./models/content')
const Comment = require('./models/comment')
const User = require('./models/user')
const seedDB = require('./seeds')

mongoose.connect('mongodb://noor:noor@ds137197.mlab.com:37197/zoovie')
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
seedDB()

//Passport configuration
app.use(require('express-session')({
  secret: 'First car was made in 1996',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})


app.get('/', (req, res) => {
  res.render('landing')
})


app.get('/content', (req, res) => {
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
      res.render('content/show', {content: foundContent})
    }
  })
})

//Comment Route
app.get('/content/:id/comments/new', isLoggedIn, (req, res) => {
  Content.findById(req.params.id, (err, content) => {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', {content: content})
    }
  })
})

app.post('/content/:id/comments', isLoggedIn, (req, res) => {
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
//============
//Auth routes
//============

//show register form
app.get('/register', (req, res) => {
  res.render('register')
})
//handle sign up logic
app.post('/register', (req, res) => {
  const newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      return res.render('register')
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/content')
    })
  })
})

//show login form
app.get('/login', (req, res) => {
  res.render('login')
})

//handling login logic
//app.post('/login', middleware, callback)
app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/content',
    failureRedirect: '/login'
  }), (req, res) => {
})

//logout route
app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/content')
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

app.listen(3000, () => {
  console.log('listening on 3000')
})
