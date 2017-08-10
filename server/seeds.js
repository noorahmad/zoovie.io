const mongoose = require('mongoose')
const Content = require('./models/content')
const Comment = require('./models/comment')

const data = [
  {
    name: "Cloud's rest",
    media: 'https://lakerooseveltadventures.com/wp-content/uploads/sites/5/2016/03/campground.jpg',
    description: "OMG A NEW CAMPGROUND"
  },
  {
    name: "Desert Hearts",
    media: "https://s-media-cache-ak0.pinimg.com/originals/9a/85/d8/9a85d8b22e42dd423da0afce92b43d28.jpg",
    description: "HOLT BLACKHEATH"
  },
  {
    name: "Yosemite",
    media: "https://www.nps.gov/yell/planyourvisit/images/bb.jpg",
    description: "ANOTHER CAMPGROUND OMG"
  }
]

var seedDB = () => {
  Content.remove({}, (err) => {
    if (err) {
      console.log(err)
    }
      console.log('removed content')
      data.forEach((seed) => {
        Content.create(seed, (err, content) => {
          if (err) {
            console.log(err)
          } else {
            console.log('added a content')
            Comment.create(
              {
                text: "this is a great content",
                author: "Homer"
              }, (err, comment) => {
                if (err) {
                  console.log(err)
                } else {
                  content.comments.push(comment)
                  content.save()
                  console.log('created a comment')
                }
              })
          }
        })
      })
  })
}

module.exports = seedDB
