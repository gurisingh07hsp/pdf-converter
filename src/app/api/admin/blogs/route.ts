import { NextRequest, NextResponse } from 'next/server';
import Blog from '../../../../../models/blog';
import { connectDB } from "@/lib/mongodb";


export async function GET() {
    connectDB();
    try {
        const blogs = await Blog.find();
        if (!blogs) {
            return NextResponse.json([]);
        }
        return NextResponse.json(blogs, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const blog = await request.json();
        const newblog = await Blog.create(blog);
        if(newblog){
            return NextResponse.json(newblog, {status: 200});
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save blog' }, { status: 500 });
    }
}
