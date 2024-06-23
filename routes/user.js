const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.schema');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 8);
  await user.save();
  const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret');
  res.status(201).send({ user, token });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user || !await bcrypt.compare(req.body.password, user.password)) {
    return res.status(400).send('Invalid login credentials');
  }
  const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret');
  res.send({ user, token });
});

router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

//User wanting to join organisation
// User selects organisations from getAllOrganisations()
// It's Id getting added to this route
router.post('/join-requests/:orgId', auth, async (req, res) => {
  try {
    //validate orgId exists
    const orgObjectId = Types.ObjectId.createFromHexString(req.params.orgId)
    const org = await Organization.findById({ orgId: orgObjectId })
    if (!org) {
      return res.status(400).send({ error: "Organization not found" })
    }
    const orgId = orgObjectId
    const userToJoinOrg = req.user._id
    const requestedBy = userToJoinOrg
    const status = 'pending'
    const joinRequestSchema = await JoinRequest.create({ orgId, userToJoinOrg, requestedBy, status })
    return res.status(201).send(joinRequestSchema)
  }
  catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
}

)



// user wants to check which orgs he has applied
router.get("/applied-orgs/", auth, async (req, res) => {
  try {
    // const orgObjectId = Types.ObjectId.createFromHexString(req.params.orgId);
    const sentByOrg = req.query.sentByOrg === "true";
    const sentByUser = req.query.sentByUser === "true";
    const userId = req.user._id

    // Validate orgId exists
    // const org = await Organization.findById(orgObjectId).lean();
    // if (!org) {
    //   return res.status(400).send({ error: "Organization not found" });
    // }

    // if (req.user._id.toString() !== org.orgOwner.toString()) {
    //   return res.status(401).send({ error: "You are not the owner of this organization" });
    // }

    // Create a query filter
    const queryFilter = {};
    if (sentByOrg) {
      set(queryFilter, "requestedBy.$ne", userId);
    }
    if (sentByUser) {
      set(queryFilter, "requestedBy", userId);
    }
    if (sentByOrg && sentByUser) {
      queryFilter = {};
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

module.exports = router;
