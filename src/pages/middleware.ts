 import { selectAuthState } from "../store/authSlice";
 import {  useSelector } from "react-redux";
 import { NextResponse } from "next/server";


 export default function middleware(req: any){
     const authState = useSelector(selectAuthState);
     let verify = authState;
     let url = req.url
    
    if(!verify && url.includes('/dashboard')){
        return NextResponse.redirect("http://localhost:3000/");
     }

    if (verify && url === "http://localhost:3000/") {
       return NextResponse.redirect("http://localhost:3000/dashboard");
     }
 }