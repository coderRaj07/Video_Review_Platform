const JoinRequest = require('../models/JoinRequest.schema');
const Organization = require('../models/Organization');
const express = require('express')
const router = express.Router();

// Route to create a join request
router.post('/join-request', async (req, res) => {
  const { userId, organizationId, role, requestedBy } = req.body;
  const joinRequest = new JoinRequest({ user: userId, organization: organizationId, role, requestedBy });
  await joinRequest.save();

  const organization = await Organization.findById(organizationId);
  organization.pendingMembers.push(joinRequest._id);
  await organization.save();

  res.status(201).json(joinRequest);
});

// Route to approve a join request
router.put('/join-request/:requestId/approve', async (req, res) => {
  const { requestId } = req.params;
  const joinRequest = await JoinRequest.findById(requestId).populate('organization');
  if (joinRequest && joinRequest.status === 'pending') {
    joinRequest.status = 'approved';
    await joinRequest.save();

    const organization = await Organization.findById(joinRequest.organization._id);
    organization.orgMembers.push(joinRequest.user);
    organization.pendingMembers.pull(joinRequest._id);
    await organization.save();

    res.status(200).json(joinRequest);
  } else {
    res.status(404).json({ message: 'Join request not found or already processed' });
  }
});

// Route to reject a join request
router.put('/join-request/:requestId/reject', async (req, res) => {
  const { requestId } = req.params;
  const joinRequest = await JoinRequest.findById(requestId).populate('organization');
  if (joinRequest && joinRequest.status === 'pending') {
    joinRequest.status = 'rejected';
    await joinRequest.save();

    const organization = await Organization.findById(joinRequest.organization._id);
    organization.pendingMembers.pull(joinRequest._id);
    await organization.save();

    res.status(200).json(joinRequest);
  } else {
    res.status(404).json({ message: 'Join request not found or already processed' });
  }
});

module.exports = router;