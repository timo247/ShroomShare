import express from 'express';
import Specy from '../schemas/species.js'

const router = express.Router();
export default router;

// Retrieves all species
router.get('/', (req, res, next) => {
    Specy.find({}).exec((err, species) => {
        if (err) {
            res.send({message: "specy could not be retrieved because" + err.message})
        } 
        res.send(species);
    });
});

// Retrieve specific specy
router.get('/:id', (req, res, next) => {
    const id = req.params.id
    Specy.find({ _id: id }).exec((err, specy) => {
        if (err) {
            res.send({message: "specy could not be retrieved because" + err.message})
        } 
        res.send(specy);
    });
});


// Add a new specy
router.post('/', (req, res, next) => {
    let specy = new Specy({
        name: req.body.name,
        description: req.body.description,
        usage: req.body.usage,
        pictureFile: req.body.pictureFile
    });
    specy.save(function (err) {
        if (err) {
            res.send({ message: 'Specy could not saved specy because: ' + err.message })
        }
        res.status(201).send({ message: "specy created successfully", data: specy })
    });
});

// Update a specy
router.patch('/:id', (req, res, next) => {
    Specy.updateOne({ _id: req.params.id }, {
        name: req.body.name,
        description: req.body.description,
        usage: req.body.usage,
        pictureFile: req.body.pictureFile
    }).exec((err, specy) => {
        if (err) {
            res.send({ message: 'Specy could not be updated because: ' + err.message })
        }
        res.send({ message: "specy updated successfully", data: specy })
    });
});

// Delete a specy
router.delete('/:id', (req, res, next) => {
    Specy.deleteOne({ _id: req.params.id }).exec((err, specy) => {
        if (err) {
            res.send({ message: 'Specy could not be deleted because: ' + err.message })
        }
        res.send({ message: "specy deleted successfully" })
    });
})
