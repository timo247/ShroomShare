import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const specySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  usage: { type: String, required: true, 
    // validate: {
    //   // Returns true if the name is valid (in lower case)
    //   validator: function(value) {
    //     if(value === 'commestible' || value === 'non-commestible') {
    //       return true
    //     }
    //     return false;
    //   },
    //   // Custom error message
    //   message: 'usage can only be commestible or non-commestible'
    // }
  },
  pictureFile: { type: String, required: true },
});
mongoose.model('Specy', specySchema, 'species');
const Specy = mongoose.model('Specy');
export default Specy;
