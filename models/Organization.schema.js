const mongoose = require('mongoose');
const { Schema } = mongoose;
const organizationSchema = new Schema({
  orgName: { type: String, required: true },
  orgOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true },    // Youtuber
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }]
});
module.exports = mongoose.model('Organization', organizationSchema);
