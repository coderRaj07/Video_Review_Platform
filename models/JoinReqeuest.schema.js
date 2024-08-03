const mongoose = require('mongoose');
const { Schema } = mongoose;
/*
Purpsose:
 requestedBy: can be a youtuber who wants other users to join his/her organization. 
  - requestedBy is the youtuber's id in this case
  - userToJoinOrg whom the youtuber wants to add

 or it can be a user who wants to join an organization. (requestedBy and userToJoinOrg is same in this case mostly editor)

 userToJoinOrg: is the user who will be added to the organization
*/
const joinRequestSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  userToJoinOrg: { type: Schema.Types.ObjectId, ref: 'User', required: true },      
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
