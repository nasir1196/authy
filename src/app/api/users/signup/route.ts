import {connect} from '@/dbConfig/dbConfig';
import {NextRequest, NextResponse} from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user";
import {sendEmail} from "@/helpers/mailer";

  connect().then(r => console.log(r))

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        //if check user already exist
        const user = await User.findOne({email})

        if (user) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //new user created
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save();

        // send verification email after last work for smtp work
        await sendEmail({email, emailType:"VERIFY", userId: savedUser._id})

        return NextResponse.json({message: "User created successfully", success: true, savedUser})

    } catch (error: any) {
        return NextResponse.json({error: error.message})
    }
}





