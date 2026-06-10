import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TOOLS_FILE = path.join(process.cwd(), 'data/tools/tools.json');

export async function GET() {
    try {
        if (!fs.existsSync(TOOLS_FILE)) {
            return NextResponse.json([]);
        }
        const data = fs.readFileSync(TOOLS_FILE, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const tool = await request.json();
        const data = fs.existsSync(TOOLS_FILE) ? JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf-8')) : [];
        
        if (tool.id) {
            // Update existing tool
            const index = data.findIndex((t: any) => t.id === tool.id);
            if (index !== -1) {
                data[index] = { ...data[index], ...tool, updatedAt: new Date().toISOString() };
                fs.writeFileSync(TOOLS_FILE, JSON.stringify(data, null, 2));
                return NextResponse.json(data[index]);
            }
            return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
        } else {
            // Create new tool
            const newTool = {
                ...tool,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            data.push(newTool);
            fs.writeFileSync(TOOLS_FILE, JSON.stringify(data, null, 2));
            return NextResponse.json(newTool);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save tool' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        if (!fs.existsSync(TOOLS_FILE)) {
            return NextResponse.json({ error: 'No tools found' }, { status: 404 });
        }
        
        let data = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf-8'));
        data = data.filter((t: any) => t.id !== id);
        fs.writeFileSync(TOOLS_FILE, JSON.stringify(data, null, 2));
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete tool' }, { status: 500 });
    }
}
