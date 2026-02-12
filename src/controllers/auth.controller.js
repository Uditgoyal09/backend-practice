import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import otpgenerator from "otp-generator";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
}
)


//sign up

export const signUp = async (req,res) => {
    console.log(req.body);

    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "missing name, email, phone and passs" });
        }
        const user = await User.create({ name, email, phone, password })
        return res.json(user);
    } catch (err) {
        console.log("signup error", err);
        return res.status(500).json({ message: "internal server error" })
    }
}

export const login=async(req,res)=>{
    try{
      const { email, password } = req.body;
        if ( !email || !password) {
            return res.status(400).json({ message: "missing name, email, phone and passs" });
        }

        const user= await User.findOne({email})  //finding user from database having same email
        if(!user){
            return res.status(400).json({message:"user not found"})
        }

        const match= await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({message: "password not matched"})
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        return res.json({ token });
        

    }catch(err){
        console.log("Login Error", err);
        return res.status(500).json({message:"Internal server error"});
    }
}

//sendotp

export const sendOtp= async(req,res)=>{
    try{
        const {name, email, phone}= req.body;
        if(!name || !email ||!phone){                                         //step-1
            return res.status(400).json({message:"Missing name, email, phone"})
        }

        const otp= otpgenerator.generate(6,{digits:true});  //step-02 -> generate otp
        const expiresAt= new Date(Date.now()+ 5*60*1000)    //step-03 -> declare expireAt to store in otpmodel

        await OTP.create({email, otp, expiresAt});  // step-04 -> create OTP schema

        await transporter.sendMail({  //step-05 -> Sending Email 
            to:email,
            subject:"Your OTP",
            text:` Hey ${name} your otp is ${otp}`
        });
        return res.json({ message: "OTP Sent" });

    }catch(err){
        console.log("Login error", err);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

//verifyotp

export const verifyOtp=async(req,res)=>{ 
    try{
        const {email, otp}= req.body;
        if(!email || !otp){
            return res.status(400).json({message:"missing email and Otp"})
        }

        //finding user from otp schema by his email
        const record = await OTP.findOne({ email }).sort({ createdAt: -1 }); // latest first
        if (!record) {
            return res.status(400).json({ message: "No OTP found" });
        }

        // checking tp expire
         if (record.expiresAt < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        //comapring otp
         const match = await bcrypt.compare(otp, record.otp);
        if (!match) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // update user in database
        await User.updateOne({ email }, { $set: { isVerified: true } });
        return res.json({ message: "Email Verified" });
    }catch(err){
        console.log("verifyotp Error",err);
        return res.status(500).json({message:"Invalid Internal Error"})
    }
}