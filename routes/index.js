var express = require('express');
var router = express.Router();
//var gcsMiddlewares = require('../middlewares/gcs');
const Multer = require('multer');
 const fs = require('fs');
const images = require('../middlewares/gcs');
const seq = require('../middlewares/seq')
Pic = seq.Pic
/* GET home page. */
router.get('/', function(req, res, next) {
   Pic.findAll({}).then(pics=>{
     //console.log(pics);
     res.render('index', { pics: pics });
   })

});

router.post(
  '/add',

  images.multer.array('myFile'),
  images.sendUploadToGCS,
  (req, res, next) => {
    //console.log(req.files)
    let data = req.body.fnames;
  //  console.log('======files : ',data);

    // Was an image uploaded? If so, we'll use its public URL
    // in cloud storage.
    if (req.file && req.file.cloudStoragePublicUrl) {
      data.imageUrl = req.file.cloudStoragePublicUrl;
    }

    data.forEach(item=>{
      Pic.create({picId:item})
    })

    //Pic.create({picId:req.body.fname}).then(()=>{
      res.redirect(`/`);
    //})


  }
);


router.get('/download/:fname',
  images.downloadFile,
  (req,res)=>{
    console.log('zxy');
    /*if (req.params.fname=='') {
      res.redirect('/')
    } else {
      images.downloadFile
      //res.redirect('/')

    }*/

})

module.exports = router;
