import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BLOGS_FILE = path.join(process.cwd(), 'data/blogs/blogs.json');

export async function GET() {
    try {
        if (!fs.existsSync(BLOGS_FILE)) {
            return NextResponse.json([]);
        }
        const data = fs.readFileSync(BLOGS_FILE, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const blog = await request.json();
        const data = fs.existsSync(BLOGS_FILE) ? JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf-8')) : [];
        
        if (blog.id) {
            // Update existing blog
            const index = data.findIndex((b: any) => b.id === blog.id);
            if (index !== -1) {
                data[index] = { ...data[index], ...blog, updatedAt: new Date().toISOString() };
                fs.writeFileSync(BLOGS_FILE, JSON.stringify(data, null, 2));
                return NextResponse.json(data[index]);
            }
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        } else {
            // Create new blog
            const newBlog = {
                ...blog,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            data.push(newBlog);
            fs.writeFileSync(BLOGS_FILE, JSON.stringify(data, null, 2));
            return NextResponse.json(newBlog);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save blog' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        if (!fs.existsSync(BLOGS_FILE)) {
            return NextResponse.json({ error: 'No blogs found' }, { status: 404 });
        }
        
        let data = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf-8'));
        data = data.filter((b: any) => b.id !== id);
        fs.writeFileSync(BLOGS_FILE, JSON.stringify(data, null, 2));
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}
