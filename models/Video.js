const mongoose = require('mongoose');
const { Schema } = mongoose;
const videoSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  uploader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});
module.exports = mongoose.model('Video', videoSchema);
