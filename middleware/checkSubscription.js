const Subscription = require('./models/Subscription');
const Organization = require('./models/Organization');

const checkSubscription = async (req, res, next) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  let organization;

  if (userRole === 'editor') {
    organization = await Organization.findOne({ members: userId }).populate('subscriptions');
  } else if (userRole === 'youtuber') {
    organization = await Organization.findOne({ owner: userId }).populate('subscriptions');
  }

  if (!organization) {
    return res.status(403).json({ message: 'Organization not found or you are not authorized.' });
  }

  const currentDate = new Date();
  const activeSubscription = organization.subscriptions.find(sub => sub.status === 'active' && sub.endDate > currentDate);

  if (!activeSubscription) {
    return res.status(403).json({ message: 'Your organization subscription has expired.' });
  }

  next();
};

module.exports = checkSubscription;
