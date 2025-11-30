import mongoose from "mongoose";

const connectDb=async ()=>{
    const uri = process.env.MONGODB_URI
    const conn =await mongoose.connect(uri)
    if(conn) {
        console.log("MongoDb Connection SuccessFully")
    }else{
        console.log("MongoDb Connection Failed")
    }
}

export default connectDb