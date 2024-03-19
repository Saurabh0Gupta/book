const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')
mongoose.connect('mongodb://0.0.0.0/book').then(() => {
  console.log('connected to db')
})

const authorSchema=mongoose.Schema({
  username:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
  },
  authorImage:{
    type:String,
    default:"dom.jpeg"
  },
  contactNum:{
    type:String,
  },
  biography:{
    type:String,
  },
  books:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'books' 
  }],
})
authorSchema.plugin(plm)
module.exports = mongoose.model('authors', authorSchema)