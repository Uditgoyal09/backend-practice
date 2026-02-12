import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userScehma= new mongoose.Schema(
    {
        name:{type:String, required:true},
        email:{type:String, required:true},
        phone:{type:String, required:true},
        password:{type:String, required:true},
        isVerified:{type:Boolean, default:false},

    },
    { timestamps:true }
);

userScehma.pre("save", async function (){
    if(!this.isModified("password")) return ;
    this.password= await bcrypt.hash(this.password,10)  //this is important
})

export default mongoose.model("User", userScehma);