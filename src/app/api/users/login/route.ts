import {connect} from "@/dbConfig/dbConfig";
import {NextRequest, NextResponse} from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user";
import jwt from "jsonwebtoken"

connect().then((r) => console.log(r))

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {email, password} = requestBody;

        // check if user exists
        const user = await User.findOne({email})
        if (!user) {
            return NextResponse.json({error: "User doesn't exists"}, {status: 400})
        }

        // check if password is correct
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return NextResponse.json({error: "Invalid Credentials. Try again later!"}, {status: 400})
        }

        // create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        // create token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!)

        const response = NextResponse.json({message: "Login successful", Success: true})
        response.cookies.set("token", token, {httpOnly: true})

        return response;

    } catch (e: any) {
        console.log(e.message);
        return NextResponse.json({error: e.message}, {status: 500});
    }
}