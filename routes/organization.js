const express = require('express');
const Organization = require('../models/Organization.schema');
const OrganizationMember = require('../models/OrganizationMember.schema');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const organization = new Organization({ ...req.body, owner: req.user._id });
  organization.members.push(req.user._id);
  await organization.save();
  const member = new OrganizationMember({
    organization: organization._id,
    user: req.user._id,
    role: 'youtuber',
  });
  await member.save();
  res.status(201).send(organization);
});

router.post('/:orgId/members', auth, async (req, res) => {
  const { orgId } = req.params;
  const member = new OrganizationMember({
    organization: orgId,
    user: req.body.userId,
    role: req.body.role,
  });
  await member.save();
  res.status(201).send(member);
});

router.get('/:orgId', auth, async (req, res) => {
  const organization = await Organization.findById(req.params.orgId).populate('members').populate('videos');
  if (!organization) {
    return res.status(404).send();
  }
  res.send(organization);
});

module.exports = router;
