const mongoose = require('mongoose');


const bookSchema=mongoose.Schema({
  bookName:String,
  ISBN:Number,
  publication:String,
  genre:String,
  publicationDate:{
    type:Date,
    default:Date.now()
  },
  bookpdf:{
    type:String
  },
  authorName:{
    type:String,
  },
  date:{
    type:Date
  }
})


module.exports = mongoose.model('books', bookSchema)