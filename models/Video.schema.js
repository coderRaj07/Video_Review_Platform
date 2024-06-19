const mongoose = require('mongoose');
const { Schema } = mongoose;
const Organization = require('./models/Organization'); 

const videoSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  uploader: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    validate: {
      validator: async function(value) {
        const organization = await Organization.findById(this.organizationId);
        return organization.members.includes(value) || organization.owner.equals(value);
      },
      message: 'Uploader must be a member or the owner of the organization'
    }
  },
  approvedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    validate: {
      validator: async function(value) {
        const organization = await Organization.findById(this.organizationId);
        return organization.owner.equals(value);
      },
      message: 'approvedBy must be the owner of the organization'
    }
  },
});

module.exports = mongoose.model('Video', videoSchema);
