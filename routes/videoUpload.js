// -------------------------The code flow has not been tested-------------------------

const express = require('express');
const { google } = require('googleapis');
const { S3Client } = require('@aws-sdk/client-s3');
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid'); 

const router = express.Router();

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


  // Upload video to S3
  const s3Client = new S3Client({
      credentials: {
          "accessKeyId": "",
          "secretAccessKey": ""
      }
  })

  router.get("/presignedUrl", authMiddleware, async (req, res) => {
    try {
      // Assuming orgId is set correctly in authMiddleware
      const orgId = req.orgId;
      const title = req.query.title || 'Untitled'; // Assuming title is passed as a query parameter
      const description = req.query.description || 'No description'; // Assuming description is passed as a query parameter
  
      const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: "s3OrgVideos",
        Key: `s3OrgVideos-folder/${orgId}/${uuidv4()}/video.mp4`, // Use uuid for unique key
        Conditions: [
          ['content-length-range', 0, 2048 * 1024 * 1024] // 2 GB max
        ],
        Fields: {
          success_action_status: '201',
          'Content-Type': 'video/mp4',
          'x-amz-meta-title': title, // Custom metadata for title
          'x-amz-meta-description': description // Custom metadata for description
        },
        Expires: 3600
      });
  
      console.log({ preSignedUrl: url, fields });
      res.send({ preSignedUrl: url, fields });
    }
    catch (error) {
      console.error("Error creating pre-signed URL", error);
      res.status(500).send({ error: "Failed to create pre-signed URL" });
    }
  })

module.exports = router;
