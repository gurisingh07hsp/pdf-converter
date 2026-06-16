import { Request, Response } from 'express';
import path from 'path';
import { PDFService } from '../../lib/pdf/pdf-service';
import fs from 'fs';

export class PDFController {
    
    /**
     * Handle PDF Compression
     */
    static async compress(req: Request, res: Response) {
        try {
            if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

            const inputPath = req.file.path;
            const outputPath = path.join(path.dirname(inputPath), `compressed_${req.file.filename}`);

            await PDFService.compressPDF(inputPath, outputPath);

            res.json({
                message: 'Compression successful',
                downloadUrl: `/download/${path.basename(outputPath)}`,
                originalName: req.file.originalname,
                newSize: fs.statSync(outputPath).size
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Handle PDF Merging
     */
    static async merge(req: Request, res: Response) {
        try {
            const files = req.files as Express.Multer.File[];
            if (!files || files.length < 2) {
                return res.status(400).json({ error: 'Please upload at least 2 PDF files' });
            }

            const inputPaths = files.map(f => f.path);
            const outputPath = path.join(path.dirname(inputPaths[0]), `merged_${Date.now()}.pdf`);

            await PDFService.mergePDFs(inputPaths, outputPath);

            res.json({
                message: 'Merge successful',
                downloadUrl: `/download/${path.basename(outputPath)}`,
                fileCount: files.length
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Handle Word/PPT/Excel to PDF Conversion
     */
    static async officeToPdf(req: Request, res: Response) {
        try {
            if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

            const inputPath = req.file.path;
            const outputDir = path.dirname(inputPath);

            const resultPath = await PDFService.convertToPDFA(inputPath, outputDir);

            res.json({
                message: 'Conversion successful',
                downloadUrl: `/download/${path.basename(resultPath)}`,
                originalName: req.file.originalname
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Handle JPG to PDF Conversion
     */
    static async jpgToPdf(req: Request, res: Response) {
        try {
            const files = req.files as Express.Multer.File[] || (req.file ? [req.file] : []);
            if (files.length === 0) return res.status(400).json({ error: 'No images uploaded' });

            const inputPaths = files.map(f => f.path);
            const outputPath = path.join(path.dirname(inputPaths[0]), `images_${Date.now()}.pdf`);

            await PDFService.imagesToPDF(inputPaths, outputPath);

            res.json({
                message: 'Conversion successful',
                downloadUrl: `/download/${path.basename(outputPath)}`,
                fileCount: files.length
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Handle PDF to PDF/A Conversion
     */
    static async pdfToPdfa(req: Request, res: Response) {
        try {
            if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

            const inputPath = req.file.path;
            const outputPath = path.join(path.dirname(inputPath), `pdfa_${req.file.filename}`);

            await PDFService.convertToPDFA(inputPath, outputPath);

            res.json({
                message: 'PDF/A conversion successful',
                downloadUrl: `/download/${path.basename(outputPath)}`,
                originalName: req.file.originalname
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Handle PDF Splitting
     */
    static async split(req: Request, res: Response) {
        try {
            if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

            const inputPath = req.file.path;
            const outputDir = path.dirname(inputPath);

            const resultPaths = await PDFService.splitPDF(inputPath, outputDir);

            // For split, we might want to zip them or just return the first one for now
            // In a real app, you'd zip all pages
            res.json({
                message: 'Split successful',
                downloadUrl: `/download/${path.basename(resultPaths[0])}`,
                pageCount: resultPaths.length
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
