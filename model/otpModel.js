import mongoose from "mongoose";

const otpSchema =new mongoose.Schema(
    {
        email:{
            type:String,
            
        },
        otp:{
           type:String,
           unique: true,
           
        },
        

    },
    {
        timestamps:true
    }
)
export default mongoose.model("Otp",otpSchema)