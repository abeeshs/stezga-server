import mongoose from "mongoose";

const inviteUserSchema =new mongoose.Schema(
    {
        email:{
            type:String,
            unique:true,
            required:true
            
        },
        referenceId:{
           type:String,
           unique: true,
           required:true
           
        },
        created_by:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        company_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Company"
        }
    },
    {
        timestamps:true
    }
)
export default mongoose.model("Invite",inviteUserSchema)