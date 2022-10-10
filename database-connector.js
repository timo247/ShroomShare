import mongoose from 'mongoose';
    //  export function connectDb(url) {
    //     // Use connect method to connect to the Server
    //     MongoClient.connect(url, function(err, db) {
    //     if (err) {
    //       console.warn('Could not connect to database because: ' + err.message);
    //     } else {
    //         return db
    //         console.log('Connected to MongoDB');
    //     }
    //   });
    //   }

    export function connectDb(url) {
        mongoose.connect(url);

    }