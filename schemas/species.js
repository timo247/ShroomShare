import mongoose from 'mongoose'
const Schema = mongoose.Schema

 const userSchema = new Schema ({
    name: {type : String, required : true}, 

	description: {type : String, required: true}, 

	usage: {type : String, required:true },  

	pictureFile: {type : String, required:true }

 })