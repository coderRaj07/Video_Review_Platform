// -------------------------The code flow has not been tested-------------------------

const express = require('express');
const { google } = require('googleapis');
const { S3 } = require('aws-sdk');

const router = express.Router();

// Initialize AWS SDK
const s3 = new S3();

// Initialize YouTube Data API client
const youtube = google.youtube({
  version: 'v3',
  auth: 'YOUR_YOUTUBE_API_KEY_OR_OAUTH_TOKEN'
});

// Fetch video from S3
async function fetchVideoFromS3(s3Bucket, s3Key) {
  const params = {
    Bucket: s3Bucket,
    Key: s3Key
  };
  const { Body } = await s3.getObject(params).promise();
  return Body;
}

// Upload video to YouTube
async function uploadVideoToYouTube(video, title, description) {
  const res = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: title,
        description: description
      },
      status: {
        privacyStatus: 'private' // Set privacy status as required
      }
    },
    media: {
      body: video
    }
  });
  console.log('Video uploaded:', res.data);
  return res.data;
}

// Express route to handle video upload from S3 to YouTube
router.post('/upload', async (req, res) => {
  try {
    const { s3Bucket, s3Key, title, description } = req.body;

    // Fetch video from S3
    const video = await fetchVideoFromS3(s3Bucket, s3Key);

    // Upload video to YouTube
    const youtubeResponse = await uploadVideoToYouTube(video, title, description);

    res.status(200).json({ message: 'Video uploaded to YouTube', youtubeResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while uploading the video to YouTube' });
  }
});

module.exports = router;
