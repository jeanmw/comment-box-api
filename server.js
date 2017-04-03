// require express and other modules
var express = require('express'),
    app = express(),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// configure cors (for allowing cross-origin requests)
app.use(cors());

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to ejs
app.set('view engine', 'ejs');

// connect to mongodb
mongoose.connect(
  'mongodb://heroku_12h2kz8m:hcl5uli0akntnkkso6men86pcs@ds149820.mlab.com:49820/heroku_12h2kz8m' ||
  'mongodb://localhost/comment-box-api'
);

//models and seed data
var Comment = require('./models/comment');
var seedComments = require('./seed.js');

// get all comments
app.get('/comments', function (req, res) {
  // find all books in db
  Comment.find(function (err, allComments) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ comments: allComments });
    }
  });
});

// create new comment
app.post('/comments', function (req, res) {
  // create new comment with form data (`req.body`)
  var newComment = new Comment(req.body);

  // save new comment in db
  newComment.save(function (err, savedComment) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json(savedComment);
    }
  });
});

//get single response and 404 if not found
function getSingularResponse (err, foundObject) {
  if (err) {
    this.status(500).json({ error: err.message });
  } else {
    if (foundObject === null) {
      this.status(404).json({ error: "Nothing found by this ID." });
    } else {
      this.status(200).json(foundObject);
    }
  }
}

app.get('/comments/:id', function(req, res){
  var commentId = req.params.id;

  //find comment by id
  Comment.findOne({_id: commentId}, getSingularResponse.bind(res));
});

//update
app.put('/comments/:id', function (req, res) {
  // get comment id from url params (`req.params`)
  var commentId = req.params.id;

  // find comment in db by id
  Comment.findOne({ _id: commentId }, function (err, foundComment) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!foundComment){
     return res.status(404).json({ error: "Nothing found by this ID." });
    }

    // update the comments' attributes
    foundComment.author = req.body.author;
    foundComment.text = req.body.text;

    // save updated comment in db
    foundComment.save(getSingularResponse.bind(res));

  });
});

app.delete('/comments/:id', function(req, res) {
  var commentId= req.params.id;
  Comment.findOneAndRemove({_id: commentId}, getSingularResponse.bind(res));
});

// HOME & RESET ROUTES

app.get('/', function (req, res) {
  res.render('site/index');
});

app.get('/reset', function (req, res) {
  res.render('site/reset');
});

app.post('/reset',function(req, res) {
  Comment.remove({}, function (err, removedComments) {
    Comment.create(seedComments, function(err, createdBooks){
      if(req.params.format === 'json') {
        res.status(201).json(createdBooks.concat(createdWines).concat(createdPokemons));
      } else {
        res.redirect('/');
      }
    });
  });
});



// listen on port (production or localhost)
app.listen(process.env.PORT || 3000, function() {
  console.log('server started');
});
