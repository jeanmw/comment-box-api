var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  author: String,
  text: String
});

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
