const mongoose = require('mongoose');
const { Schema } = mongoose;
const organizationMemberSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['youtuber', 'editor'], required: true },  // May be in future we may want to give other roles 
});
module.exports = mongoose.model('OrganizationMember', organizationMemberSchema);
