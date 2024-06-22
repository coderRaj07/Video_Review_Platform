const videoUploadQueue = require('../queues/videoUploadQueue');
const AWS = require('aws-sdk');
const fs = require('fs');
const Video = require('../models/Video.schema');
const Organization = require('../models/Organization.schema');
const s3 = new AWS.S3({
  accessKeyId: 'YOUR_AWS_ACCESS_KEY',
  secretAccessKey: 'YOUR_AWS_SECRET_KEY',
  region: 'YOUR_AWS_REGION',
});

videoUploadQueue.process(async (job, done) => {
  const { file, videoData } = job.data;
  const params = {
    Bucket: 'your-s3-bucket',
    Key: file.filename,
    Body: fs.createReadStream(file.path),
    ContentType: file.mimetype,
  };
  s3.upload(params, async (err, data) => {
    if (err) {
      return done(new Error('S3 upload failed'));
    }
    const video = new Video({
      title: videoData.title,
      url: data.Location,
      uploader: videoData.uploaderId,
      organization: videoData.organizationId,
    });
    await video.save();
    const organization = await Organization.findById(videoData.organizationId);
    organization.videos.push(video._id);
    await organization.save();
    done();
  });
});
