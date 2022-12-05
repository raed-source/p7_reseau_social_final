const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
      // id: { type: String, required: true },
  userId: { type: String, required: true },
  comment: { type: String, required: true },
  content: { type: String, required: true },
  dateCreate: { type: Date },
 
},{  timestamps: true});

module.exports = mongoose.model("Comment", postSchema);
