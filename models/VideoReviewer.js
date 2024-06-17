const mongoose = require('mongoose');
const { Schema } = mongoose;
const videoReviewerSchema = new Schema({
  video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});
module.exports = mongoose.model('VideoReviewer', videoReviewerSchema);
