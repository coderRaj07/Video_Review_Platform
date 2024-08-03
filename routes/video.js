const express = require('express');
const multer = require('multer');
const fs = require('fs');
const videoUploadQueue = require('../queues/videoUploadQueue');
const auth = require('../middleware/auth');
const Organization = require('../models/Organization.schema');
const Video = require('../models/Video.schema');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/:orgId/upload', auth, upload.single('video'), async (req, res) => {
  const { orgId } = req.params;
  const file = req.file;
  const organization = await Organization.findById(orgId);
  if (!organization || !organization.members.includes(req.user._id)) {
    return res.status(403).send('Not authorized');
  }
  const videoData = {
    title: req.body.title,
    uploaderId: req.user._id,
    organizationId: orgId,
  };
  // Add job to queue
  videoUploadQueue.add({ file, videoData });
  res.status(200).send('Video upload queued');
});

router.post('/:videoId/approve', auth, async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video || !video.organization.members.includes(req.user._id)) {
    return res.status(403).send('Not authorized');
  }
  video.approvedBy = req.user._id;
  await video.save();
  res.send(video);
});

module.exports = router;
