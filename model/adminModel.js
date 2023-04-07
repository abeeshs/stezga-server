import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
    {
        firstname:{
            type:String,
            required:[true,'Please enter firstname']
        },
        lastname:{
            type:String,
            required:[true,'Please enter lastname']
        },
        email:{
           type:String,
           unique: true,
            required:[true,"please enter email address"]
        },
        mobile:{
            type:Number,
            reqiured:[true,'Pleace enter mobile number']
        },
        password:{
            type:String,
            required:[true,"Please enter password"]
        },
        confirmPassword:{
            type:String,
        },
    },
    {
        timestamps:true
    }
)

export default mongoose.model('Admin',adminSchema);