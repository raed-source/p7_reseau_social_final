const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  // id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imgUrl: { type: String, required: true },
  dateCreate: { type: Date },
  // like: { type: String },
  // dislike: { type: String },
  location: { type: String },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

module.exports = mongoose.model("Post", postSchema);


