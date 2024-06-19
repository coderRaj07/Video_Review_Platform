const mongoose = require('mongoose');
const { Schema } = mongoose;

const joinRequestSchema = new Schema({
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // The user who initiated the request
  role: { type: String, enum: ['youtuber', 'editor'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
