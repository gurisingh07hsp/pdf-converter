import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

const SEO_FILE = path.join(process.cwd(), 'data/seo/settings.json');

export function getSEOSettings(tool: string) {
    try {
        if (!fs.existsSync(SEO_FILE)) {
            return null;
        }
        const data = JSON.parse(fs.readFileSync(SEO_FILE, 'utf-8'));
        return data[tool] || null;
    } catch (error) {
        console.error('Error reading SEO settings:', error);
        return null;
    }
}

export function generateToolMetadata(tool: string, defaultTitle: string, defaultDescription: string): Metadata {
    const settings = getSEOSettings(tool);
    
    return {
        title: settings?.title || `${defaultTitle} - PDFSwift`,
        description: settings?.description || defaultDescription,
        keywords: settings?.keywords || "pdf, converter, online, free",
    };
}
