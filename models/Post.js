const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String , required: true},
    description: { type: String},
});
 
var Post = mongoose.model('Post', PostSchema);
module.exports = Post;