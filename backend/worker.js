// #!/usr/bin/env node
// /**
//  * @module worker.js
//  */
// import Queue from 'bull';
// import dbClient from './utils/db';

// console.log('Processing Background jobs...')

// /* Create the fileQueue */
// const fileQueue = new Queue(
//   'fileQueue',
//   'redis://localhost:6379'
// );

// /* Define the job processing function. */
// fileQueue.process(async (job) => {
//   const { fileId, userId } = job.data;

//   if (!fileId) throw new Error('Missing fileId');
//   if (!userId) throw new Error('Missing userId');

//   const files = dbClient.db.collection('files');
//   const users = dbClient.db.collection('users');
//   users.find({ _id: userId}, (err, user) => {
//     if (err) throw new Error(err);

//     if (!user) {
//       throw new Error('No user found')
//     }

//     files.findOne({ _id: fileId, userId: userId }, (err, file) => {

//     });
//   });
// });


import Queue from 'bull';
import thumbnail from 'image-thumbnail';

// Create the fileQueue
const fileQueue = new Queue('fileQueue');

// Define the processing function for the queue
fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  // Check if fileId and userId are present
  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  // Simulate finding the file document in the database based on fileId and userId
  const fileDocument = await findFileDocument(fileId, userId);

  // Check if file document is found
  if (!fileDocument) {
    throw new Error('File not found');
  }

  // Generate thumbnails
  const thumbnailWidths = [500, 250, 100];
  const originalFilePath = fileDocument.filePath;

  const thumbnailPromises = thumbnailWidths.map((width) => {
    const thumbnailFilePath = getThumbnailFilePath(originalFilePath, width);
    const thumbnailOptions = { width };

    return thumbnail(originalFilePath, thumbnailOptions)
      .then((thumbnailBuffer) => {
        // Save the thumbnail to the same location as the original file with appended width
        return saveThumbnailToFile(thumbnailFilePath, thumbnailBuffer);
      });
  });

  // Wait for all thumbnail generation promises to complete
  await Promise.all(thumbnailPromises);

  // Return any necessary result or data
  return { success: true };
});

// Helper function to find the file document in the database
function findFileDocument(fileId, userId) {
  // Replace with your actual implementation to find the file document in the database
  // based on the provided fileId and userId
  return new Promise((resolve, reject) => {
    // Simulate async database query
    setTimeout(() => {
      resolve({ fileId, userId, filePath: '/path/to/original-file.jpg' });
    }, 1000);
  });
}

// Helper function to generate the thumbnail file path
function getThumbnailFilePath(originalFilePath, width) {
  const extension = originalFilePath.split('.').pop();
  const thumbnailFileName = `${originalFilePath}_${width}.${extension}`;
  return thumbnailFileName;
}

// Helper function to save the thumbnail to a file
function saveThumbnailToFile(thumbnailFilePath, thumbnailBuffer) {
  // Replace with your actual implementation to save the thumbnail buffer to a file
  // using the provided thumbnailFilePath
  return new Promise((resolve, reject) => {
    // Simulate async file saving
    setTimeout(() => {
      console.log(`Thumbnail saved: ${thumbnailFilePath}`);
      resolve();
    }, 500);
  });
}
