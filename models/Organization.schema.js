const mongoose = require('mongoose');
const { Schema } = mongoose;
const organizationSchema = new Schema({
  orgName: { type: String, required: true },
  orgOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true },    // Youtuber
  orgMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],                // Editors
  pendingMembers: [{ type: Schema.Types.ObjectId, ref: 'JoinRequest' }],
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }]
});
module.exports = mongoose.model('Organization', organizationSchema);
