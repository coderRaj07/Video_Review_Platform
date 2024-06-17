const videoUploadWorker = require('./workers/videoUploadWorker');

// Log successful job completion
videoUploadWorker.on('completed', (job, result) => {
  console.log();
});

// Log job failure
videoUploadWorker.on('failed', (job, err) => {
  console.error();
});

console.log('Worker is running...');
