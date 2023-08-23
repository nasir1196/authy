import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/user";
import {NextRequest, NextResponse} from "next/server";
import {undefined} from "zod";


connect().then(r => console.log(r))


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {token} = reqBody

        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}})

        if (!user) {
            return NextResponse.json({error: "Invalid Token"}, {status: 400})
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save()

        return NextResponse.json({message: "Email verified successfully", success: true})

    } catch (error: any) {
        NextResponse.json({error: error.message}, {status: 500})
    }
}