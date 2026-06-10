import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SEO_FILE = path.join(process.cwd(), 'data/seo/settings.json');

export async function GET() {
    try {
        if (!fs.existsSync(SEO_FILE)) {
            return NextResponse.json({});
        }
        const data = fs.readFileSync(SEO_FILE, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { tool, settings } = await request.json();
        const data = fs.existsSync(SEO_FILE) ? JSON.parse(fs.readFileSync(SEO_FILE, 'utf-8')) : {};
        
        data[tool] = settings;
        fs.writeFileSync(SEO_FILE, JSON.stringify(data, null, 2));
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save SEO settings' }, { status: 500 });
    }
}
