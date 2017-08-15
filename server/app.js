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

const commentRoutes = require('./routes/comments')
const contentRoutes = require('./routes/content')
const indexRoutes = require('./routes/index')

mongoose.connect('mongodb://noor:noor@ds137197.mlab.com:37197/zoovie')
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
//seed the database
// seedDB()

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

app.use("/", indexRoutes)
app.use("/content", contentRoutes)
app.use("/content/:id/comments", commentRoutes)

app.listen(3000, () => {
  console.log('listening on 3000')
})
