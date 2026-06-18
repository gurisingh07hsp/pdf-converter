// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Signup error", error },
      { status: 500 }
    );
  }
}