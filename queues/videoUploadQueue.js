const Bull = require('bull');
const videoUploadQueue = new Bull('videoUploadQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});
module.exports = videoUploadQueue;
