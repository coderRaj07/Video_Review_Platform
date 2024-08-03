const express = require('express');
const { set } = require("lodash");
const Organization = require('../models/Organization.schema');
const OrganizationMember = require('../models/OrganizationMember.schema');
const JoinRequest = require("../models/JoinReqeuest.schema")
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


// Organisation sending request to the user
// to join his organisation
router.post('/join-requests/:orgId', auth, async (req, res) => {
  try {

    const { userToJoinOrg } = req.body
    const orgObjectId = Types.ObjectId.createFromHexString(req.params.orgId)

    //validate orgId exists
    const org = await Organization.findById({ orgId: orgObjectId }).lean()
    if (!org) {
      return res.status(400).send({ error: "Organization not found" })
    }

    // validate request is sent by orgOwner only
    if (req.user._id != org.orgOwner) {
      return res.status(401).send({ error: "You are not the owner of this organization" })
    }

    const orgId = orgObjectId
    const requestedBy = req.user._id
    const status = 'pending'

    const joinRequestSchema = await JoinRequest.create({ orgId, userToJoinOrg, requestedBy, status })
    return res.status(201).send(joinRequestSchema)
  }

  catch (error) {
    // Handle exceptions
    console.error("Error creating join request:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
})



// organisations can check whom they have sent requests to join
// or who wants to join the organisation
router.get("/pending-requests/:orgId", auth, async (req, res) => {
  try {
    const orgObjectId = Types.ObjectId.createFromHexString(req.params.orgId);
    const sentByOrg = req.query.sentByOrg === "true";
    const sentByUser = req.query.sentByUser === "true";

    // Validate orgId exists
    const org = await Organization.findById(orgObjectId).lean();
    if (!org) {
      return res.status(400).send({ error: "Organization not found" });
    }

    if (req.user._id.toString() !== org.orgOwner.toString()) {
      return res.status(401).send({ error: "You are not the owner of this organization" });
    }

    // Create a query filter
    const queryFilter = { orgId: orgObjectId };
    if (sentByOrg) {
      set(queryFilter, "requestedBy", org.orgOwner);
    }
    if (sentByUser) {
      set(queryFilter, "requestedBy.$ne", org.orgOwner);
    }
    if (sentByOrg && sentByUser) {
      queryFilter = { orgId: orgObjectId }
    }

    // Validate query parameters using Joi
    const querySchema = Joi.object({
      sentByOrg: Joi.boolean(),
      sentByUser: Joi.boolean(),
    });
    const { error } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const joinRequests = await JoinRequest.find(queryFilter).lean();
    const usersToJoinOrg = joinRequests.map((joinee) => joinee.userToJoinOrg);
    return res.status(200).json({ usersToJoinOrg });
  }
  catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
});



// router.get("/",auth, async (req, res) =>{
//   res.send(req.headers)
// })

module.exports = router;
