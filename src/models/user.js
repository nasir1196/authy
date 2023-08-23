import mongoose from "mongoose"
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise

const userSchema = new Schema({
    username:{
        type:String,
        required:[true, "please provide a username"],
        unique:true
    },
    email:{
        type:String,
        required:[true, "please provide a email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"please provide password"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default: false
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyTokenExpiry:Date,
})

const User = mongoose.model.user || mongoose.model("user",userSchema);

export default  User;