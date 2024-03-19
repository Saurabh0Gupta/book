var express = require('express');
var router = express.Router();
const passport=require('passport')
const localStrategy=require('passport-local')
const authorModel=require('./users')
const bookModel=require('./book')
passport.use(new localStrategy(authorModel.authenticate()))
const upload=require('./multer')
const bookupload=require('./bookmulter')

/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/register', function(req, res, next) {
  res.render('register');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/feed', function(req, res, next) {
  res.render('feed');
});
router.get('/post', function(req, res, next) {
  res.render('post');
});
router.get('/profile',isLoggedIn,async function(req, res, next) {
  const author=await authorModel.findOne({username:req.session.passport.user}).populate('books')
  console.log(author)
  res.render('profile',{author});
});
router.get('/edit',isLoggedIn,async function(req, res, next) {
  const author=await authorModel.findOne({username:req.session.passport.user})
  res.render('edit',{author});
});

router.post('/updated',isLoggedIn,async(req,res)=>{
  const author=await authorModel.findOneAndUpdate({username:req.session.passport.user},{biography:req.body.bio,contactNum:req.body.contact},{new:true})
  console.log(author)
  res.redirect('/profile')
})
//*********************Authentication**************************/
router.post('/register',function(req, res, next) {
  try {
    const author=new authorModel({
      username :req.body.username,
      email:req.body.email,
     })
     authorModel.register(author,req.body.password)
     .then(function(){
       passport.authenticate('local')(req,res,function(){
      res.redirect('/');
       })
     })
  } catch (error) {
    console.log(error.message)
  }
});
router.post('/login',passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
}),(req,res)=>{
})
function isLoggedIn(req,res,next){
  if(req.isAuthenticated())return next();
  res.redirect("/login");
}
//*********************Authentication**************************/
//*********************multer upload**************************/
router.post('/upload',isLoggedIn, upload.single('file'),async (req,res,next)=>{
  const author=await authorModel.findOne({username:req.session.passport.user})
  author.authorImage=req.file.filename;
  await author.save();
  console.log(author)
  res.redirect('/edit');
})
//*********************multer upload**************************/
//*********************post book**************************/
router.post('/postbook',isLoggedIn,async(req,res)=>{
  const author=await authorModel.findOne({username:req.session.passport.user})
  const book=await bookModel.create({
    bookName:req.body.bookname,
  ISBN:req.body.ISBN,
  publication:req.body.publication,
  genre:req.body.genre,
  })
  author.books.push(book._id)
  await author.save();
  console.log(book)
  res.render('uploadbook',{book})
})
//*********************post book**************************/
//*********************post book**************************/
router.post('/uploadbook/:bookid',isLoggedIn,bookupload.single('pdf'),async(req,res)=>{
  const author=await authorModel.findOne({username:req.session.passport.user})
  const book=await bookModel.findOne({_id:req.params.bookid})
  book.bookpdf=req.file.filename
  await book.save();
  console.log(book)
  res.redirect('/profile')
})
//*********************post book**************************/

module.exports = router;
