var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
  author: String,
  text: String
});

var Comment = mongoose.mode;('Comment', CommentsSchema);
module.exports = Comment;
