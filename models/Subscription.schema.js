const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  plan: { type: String, enum: ['monthly', 'quarterly', 'half-yearly', 'yearly'], required: true },
  status: { type: String, enum: ['active', 'queued', 'expired'], default: 'active' },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
