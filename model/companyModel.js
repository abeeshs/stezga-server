import mongoose from "mongoose";

const companySchema =new mongoose.Schema(
    {
        name:{
            type:String,
            
        },
        address:{
            type:String
        },
        company_owner:{
            type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
        }  
    },
    {
        timestamps:true
    }
)
export default mongoose.model("Company",companySchema)