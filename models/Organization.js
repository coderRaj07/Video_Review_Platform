const mongoose = require('mongoose');
const { Schema } = mongoose;
const organizationSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
});
module.exports = mongoose.model('Organization', organizationSchema);
