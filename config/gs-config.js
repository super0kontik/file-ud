const {Storage} = require('@google-cloud/storage');

  const GOOGLE_CLOUD_PROJECT_ID = "fileud-240514"; // Replace with your project ID
  const GOOGLE_CLOUD_KEYFILE = './fileUD-fc46a0f338f0.json'; // Replace with the path to the downloaded private key

  const storage = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  });
  //const bucketName = 'file_ud'
exports.getPublicUrl = (bucketName, fileName) => `https://storage.googleapis.com/${bucketName}/${fileName}`;

exports.copyFileToGCS = (localFilePath, bucketName, options) => {
    options = options || {};

    const bucket = storage.bucket();
    const fileName = path.basename(localFilePath);
    const file = bucket.file(fileName);

    return bucket.upload(localFilePath, options)
      .then(() => file.makePublic())
      .then(() => exports.getPublicUrl(bucketName, gcsName));
  };
