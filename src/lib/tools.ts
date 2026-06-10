import fs from 'fs';
import path from 'path';

const TOOLS_FILE = path.join(process.cwd(), 'data/tools/tools.json');

export function getToolBySlug(slug: string) {
    try {
        if (!fs.existsSync(TOOLS_FILE)) return null;
        const data = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf-8'));
        return data.find((t: any) => t.slug === slug) || null;
    } catch (error) {
        console.error('Error reading tool data:', error);
        return null;
    }
}

export function getAllTools() {
    try {
        if (!fs.existsSync(TOOLS_FILE)) return [];
        const data = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf-8'));
        return data;
    } catch (error) {
        console.error('Error reading tools data:', error);
        return [];
    }
}
