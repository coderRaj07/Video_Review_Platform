const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const organizationRouter = require('./routes/organization');
const videoRouter = require('./routes/video');
const videoUploadWorker = require('./worker');
const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true });
app.use('/users', userRouter);
app.use('/organizations', organizationRouter);
app.use('/videos', videoRouter);
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
