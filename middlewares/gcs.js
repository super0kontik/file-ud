const {Storage} = require('@google-cloud/storage');
//const config = require('../config');

const CLOUD_BUCKET = 'file_ud';
const GOOGLE_CLOUD_KEYFILE = './config/fileUD-fc46a0f338f0.json';
const storage = new Storage({
  projectId:  "calcium-doodad-230200",
  keyFilename: GOOGLE_CLOUD_KEYFILE
});
const bucket = storage.bucket(CLOUD_BUCKET);


let allowedFiles=['image/jpeg','image/png','application/pdf']
// Returns the public, anonymously accessable URL to a given Cloud Storage
// object.
// The object's ACL has to be set to public read.
// [START public_url]
function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}
// [END public_url]

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
function sendUploadToGCS (req, res, next) {
  req.body.fnames=[]
  req.files.forEach(item =>{

    if(allowedFiles.indexOf(item.mimetype)==-1){
      console.log('wrong mime type');
      if(req.files.length==1){
        return res.redirect('/')
      }else {
        return;
      }

    }else{

    const gcsname = Date.now() + item.originalname;
    const file = bucket.file(gcsname);
    req.body.fnames.push(gcsname)
    const stream = file.createWriteStream({
      metadata: {
        contentType: item.mimetype
      },
      resumable: false
    });

    stream.on('error', (err) => {
      item.cloudStorageError = err;
      next(err);
    });

    stream.on('finish', () => {
      item.cloudStorageObject = gcsname;
      file.makePublic().then(() => {
        item.cloudStoragePublicUrl = getPublicUrl(gcsname);
        next();
      });
    });

    stream.end(item.buffer);
  }
  })
  }

function downloadFile(req,res,next) {
  console.log('trying');
  const remoteFile = bucket.file(req.params.fname);
  //const localFilename = '/Users/stephen/Photos/image.png';
  let orName = req.params.fname.slice(13)
  let mime=req.params.fname.slice(req.params.fname.lastIndexOf('.')+1)
  console.log(mime)
if (mime=='png'||mime=='jpeg') {
  mime='image/'+mime
} else {
  mime = 'application/pdf'
}


  remoteFile.createReadStream()
    .on('error', function(err) {
      res.send("Ошибка, попробуй еще раз");
    })
    .on('response', function(response) {
      console.log('Server connected and responded with the specified status and headers.');
      res.writeHead(200, {
        'Content-Type': mime,
        'Content-Disposition': 'attachment; filename=' + orName
      });
     })
    .on('end', function() {
      console.log('The file is fully downloaded.');
    })
    .pipe(res);


}


// [END process]

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
// [START multer]
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});
// [END multer]

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
  downloadFile,
  multer
};
