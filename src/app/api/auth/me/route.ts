import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import  User  from "../../../../../models/user";

export async function GET(req: any) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const decoded: any = verifyToken(token);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user:  user});
  } catch {
    return NextResponse.json({ user: null });
  }
}