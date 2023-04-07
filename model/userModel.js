import mongoose from "mongoose";

const userSchema =new mongoose.Schema(
    {
        username:{
            type:String,
            
        },
        firstname:{
            type:String
        },
        lastname:{
            type:String
        },
        email:{
           type:String,
           unique: true,
           
        },
        mobile:{
            type:Number,
           
        },
        password:{
            type:String,
            select:false
           
        },
        confirmPassword:{
            type:String,
           
        },
        is_block:{
            type:Boolean,
            default:false
        },
        company_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Company'
        },
        role:{
            type:String
        },
        user_type:{
            type:String,
            default:"owner"
        }
       

    },
    {
        timestamps:true
    }
)
export default mongoose.model("User",userSchema)