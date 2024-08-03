const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription.schema');
const Organization = require('../models/Organization.schema');


/**
 * Purpose:
 * If a current subscription is active, the new plan will take effect once the current plan expires. 
 * The function ensures that only the organization's owner can change it's subscription plan. 
 * 
 */
router.post('/change-plan', async (req, res) => {
  const userId = req.user._id;
  const { organizationId, newPlan } = req.body;

  const organization = await Organization.findOne({ _id: organizationId, owner: userId }).populate('subscriptions');
  
  if (!organization) {
    return res.status(403).json({ message: 'You are not authorized to change the subscription plan for this organization.' });
  }

  const currentSubscriptions = organization.subscriptions.filter(sub => sub.status === 'active');
  const currentDate = new Date();

  let startDate = currentDate;
  if (currentSubscriptions.length > 0) {
    const activeSubscription = currentSubscriptions[0];
    startDate = activeSubscription.endDate;
  }

  const newSubscription = new Subscription({
    organization: organization._id,
    startDate: startDate,
    endDate: calculateEndDate(startDate, newPlan),
    plan: newPlan,
    status: startDate > currentDate ? 'queued' : 'active',
  });

  await newSubscription.save();

  organization.subscriptions.push(newSubscription._id);
  await organization.save();

  res.json({ message: 'Subscription plan queued successfully.' });
});

const calculateEndDate = (startDate, plan) => {
  const endDate = new Date(startDate);
  switch (plan) {
    case 'monthly':
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case 'quarterly':
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case 'half-yearly':
      endDate.setMonth(endDate.getMonth() + 6);
      break;
    case 'yearly':
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    default:
      throw new Error('Invalid subscription plan');
  }
  return endDate;
};

module.exports = router;
