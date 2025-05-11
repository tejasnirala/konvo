import mongoose from "mongoose";

export default async function connect () {  
  await mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to database.")
  }).catch(err => {
    console.log(err);
  })
}
