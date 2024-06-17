const mongoose = require('mongoose');
const { Schema } = mongoose;
const organizationMemberSchema = new Schema({
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['youtuber', 'editor'], required: true },
});
module.exports = mongoose.model('OrganizationMember', organizationMemberSchema);
