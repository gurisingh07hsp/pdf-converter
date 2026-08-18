import { NextRequest, NextResponse } from 'next/server';
import Blog from '../../../../../../models/blog';
import { connectDB } from "@/lib/mongodb";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
    connectDB();
    const { id } = await params;
    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return NextResponse.json("no blog found!");
        }
        return NextResponse.json(blog, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
    connectDB();
    const { id } = await params;
    const blog = await req.json();
    try {
        if (!id) {
        return NextResponse.json(
            { error: "Blog ID is required" },
            { status: 400 }
        );
        }
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            blog,
            {
                new: true,
                runValidators: true,
            }
        );
        return NextResponse.json(updatedBlog, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to Update blog' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
    connectDB();
    const { id } = await params;
    try {
        if (!id) {
        return NextResponse.json(
            { error: "Blog ID is required" },
            { status: 400 }
        );
        }
        const deletedBlog = await Blog.findByIdAndDelete(id);
        return NextResponse.json({message: 'Deleted Successfully!'}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to Update blog' }, { status: 500 });
    }
}
