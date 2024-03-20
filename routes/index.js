var express = require('express');
var router = express.Router();
const passport=require('passport')
const localStrategy=require('passport-local')
const authorModel=require('./users')
const bookModel=require('./book')
passport.use(new localStrategy(authorModel.authenticate()))
const upload=require('./multer')
const bookupload=require('./bookmulter')
const fs=require('fs')

/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  const user=req.user
  res.render('index', { title: 'Express',user });
});
router.get('/register', function(req, res, next) {
  res.render('register');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/feed',isLoggedIn, async function(req, res, next) {
  const author=await authorModel.findOne({username:req.session.passport.user}).populate('books')
    const books=await bookModel.find()
  res.render('feed',{books});
});
router.get('/post',isLoggedIn, function(req, res, next) {
  res.render('post');
});
router.get('/nav', function(req, res, next) {
  res.render('nav');
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
  // console.log(author)
  res.redirect('/profile')
})
//*********************Authentication**************************/
router.post('/register',function(req, res, next) {
    console.log("hello 51")
    const author=new authorModel({
      username :req.body.username,
      email:req.body.email,
     })
     authorModel.register(author,req.body.password)
     .then(function(){
       passport.authenticate('local')(req,res,function(){
      })
      console.log("hello 62")
      res.redirect('/');
    })

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
  // console.log(author)
  res.redirect('/edit');
})
//*********************multer upload**************************/
//*********************post book**************************/
router.post('/postbook',isLoggedIn,async(req,res)=>{
  try {
    const author = await authorModel.findOne({ username: req.session.passport.user });
    if (!author) {
        throw new Error('Author not found');
    }

    const book = await bookModel.create({
        bookName: req.body.bookname,
        ISBN: req.body.isbn,
        publication: req.body.publication,
        genre: req.body.genre,
    });

    book.date = book.publicationDate.toDateString();
    author.books.push(book._id);
    book.authorName = author.username;
    await book.save();
    await author.save();

    console.log(book.date);
    console.log(book);
    res.render('uploadbook', { book });
} catch (error) {
    console.error('Error uploading book:', error);
    res.status(500).send('Error uploading book: ' + error.message);
}

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
//*********************delete & update book**************************/
router.get('/deletebook/:bookId',isLoggedIn, async(req,res)=>{
  const book=await bookModel.findOneAndDelete({_id:req.params.bookId})
  console.log(book)
  res.redirect('/profile')
})
router.get('/updatebook/:bookId',isLoggedIn,async(req,res)=>{
  const book=await bookModel.findOne({_id:req.params.bookId})
  res.render('updatebook',{book})
})
router.post('/updatedbook/:bookId',isLoggedIn, async(req,res)=>{
  const book=await bookModel.findOneAndUpdate({_id:req.params.bookId},{bookName:req.body.bookname,ISNB:req.body.isbn,genre:req.body.genre},{new:true})
  console.log(book)
  res.redirect('/profile')
})
//*********************delete & update book**************************/
//*********************delete & update book**************************/
router.post('/searchbook',isLoggedIn,async (req,res)=>{
  const searchInput=req.body.searchInput
  const data=req.body.genre
  var allUsers
  if('authorName'===data){
    allUsers = await bookModel.find({
      authorName: {
        $regex: searchInput,
        $options: 'i'
      }
    })
  }else if('genre'===data){
     allUsers = await bookModel.find({
      genre: {
        $regex: searchInput,
        $options: 'i'
      }
    })
  }else if('publication'===data){
     allUsers = await bookModel.find({
      publication: {
        $regex: searchInput,
        $options: 'i'
      }
    })
  }else if('bookName'===data){
     allUsers = await bookModel.find({
      bookName: {
        $regex: searchInput,
        $options: 'i'
      }
     
    })
  }
    console.log(allUsers)
    res.status(200).json({allUsers,message:"pahucha"})
  
})
router.get('/deleteaccount/:id',async (req,res)=>{
  const author=await authorModel.findOneAndDelete({_id:req.params.id})
  res.redirect('/register')
})

//*********************delete & update book**************************/
//*********************logout code**************************/
router.get('/logout',isLoggedIn, (req, res) => {
  req.logout(function(err) {
    if (err) {
        console.error('Error logging out:', err);
        return res.status(500).send('Error logging out');
    }
    res.redirect('/')
});
});
//*********************logout code**************************/

module.exports = router;
