"use client";
import React, {useEffect} from "react"
import {useRouter} from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";


export default function SignupPage() {

    const router = useRouter();

    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: ""
    })
    const [buttonDisable, setButtonDisable] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const onSignup = async () => {
        try {
            setLoading(true)
            const respond = await axios.post("/api/users/signup",
                user
            )
            router.push("/login")

        } catch (error: any) {
            console.log("Signup failed", error.message)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisable(false)
        } else {
            setButtonDisable(true)
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen -py-2  text-white">
            <h1 className="text-center text-2xl">{loading ? "Processing" : "Signup"}</h1>
            <hr/>
            <label htmlFor="userName">username</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-teal-800"
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value})}
                placeholder="username"
            />

            <label htmlFor="userName">email</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-teal-800"
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                placeholder="email"
            />

            <label htmlFor="userName">password</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-teal-800"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                placeholder="password"
            />
            <button
                onClick={onSignup}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 ">
                {buttonDisable ? "No Signup" : "Signup here"}
            </button>
            <Link href="/login">Visit Login page</Link>
        </div>
    )
}