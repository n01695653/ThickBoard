import mongoose from "mongoose";

 export const connectdb = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected Successfully! ")
    } catch (error) {
        console.error("Error Connecting MongoDB ", error)
        process.exit(1)//exit with the failure 
    }
}