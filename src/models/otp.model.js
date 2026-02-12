import mongoose from "mongoose";
import bcrypt from "bcrypt";

const OtpSchema= new mongoose.Schema(
    {
        email:{type:String, required:true},
        otp:{type:String , required:true},
        expiresAt:{type:Date,}
    }
);

OtpSchema.pre("save", async function (){
    if(!this.isModified("otp")) return ;
    this.otp= await bcrypt.hash(this.otp,10);
})

export default mongoose.model("OTP", OtpSchema)