import express from 'express';
import Specy from '../schemas/species.js';
import {base64_encode, base64_decode} from '../utils/imgBase64.js';


const router = express.Router();



router.post('/', (req, res, next) => {
    const specy = new Specy({
        name : req.body.name,
        description: req.body.description ,
        usage: req.body.usage,
        pictureFile: req.body.pictureFile
      });
    
      specy.save((err) => {
        if (err) return console.warn(`Could not save specy because: ${err.message}`);
        res.send(specy).status(200);
        return console.log('specy succesfully added to db') 
      });

  });


//   router.post('/testimg', (req, res, next)=>{
//     console.log("oui");
//       let image = JSON.parse(req)
//       console.log(image)
//       // let imageencode = base64_encode(image);
//        // console.log(imageencode);
//     // res.send(imageencode);
//    });

router.get('/', (req, res, next)=> {
    Specy.find().sort('name').exec((err, spieces) => {
        if (err) return next(err);
        res.send(spieces);
      });
})

router.delete('/:id', (req, res, next) => {
    const id =  req.params.id;
    Specy.remove({_id:id}, function(err){
        if (err) return next(err);
        res.send("Succefully deleted").status(200);
    });
    
   
  });

export default router;