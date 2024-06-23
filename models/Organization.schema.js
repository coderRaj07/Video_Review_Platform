const mongoose = require('mongoose');
const { Schema } = mongoose;
const organizationSchema = new Schema({
  orgName: { type: String, required: true,  unique: true },
  orgOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true },    // Give "youtuber" role to the owner in "OrganizationMember" schema
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }]
});
module.exports = mongoose.model('Organization', organizationSchema);
