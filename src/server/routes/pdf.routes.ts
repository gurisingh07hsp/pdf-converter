import { Router } from 'express';
import { PDFController } from '../controllers/pdf.controller';
import { upload } from '../utils/storage';

const router = Router();

// Route for compression
router.post('/compress', upload.single('file'), PDFController.compress);

// Route for merging
router.post('/merge', upload.array('files'), PDFController.merge);

// Route for splitting
router.post('/split', upload.single('file'), PDFController.split);

// Office to PDF routes
router.post('/word-to-pdf', upload.single('file'), PDFController.officeToPdf);
router.post('/powerpoint-to-pdf', upload.single('file'), PDFController.officeToPdf);
router.post('/excel-to-pdf', upload.single('file'), PDFController.officeToPdf);
router.post('/html-to-pdf', upload.single('file'), PDFController.officeToPdf);

// Image to PDF route
router.post('/jpg-to-pdf', upload.array('files'), PDFController.jpgToPdf);

// PDF to PDF/A route
router.post('/pdf-to-pdfa', upload.single('file'), PDFController.pdfToPdfa);

// PDF to Office/Image routes (using officeToPdf for now if it supports bidirectional, 
// but usually it requires different commands. For now let's at least point them to something)
router.post('/pdf-to-word', upload.single('file'), PDFController.officeToPdf);
router.post('/pdf-to-excel', upload.single('file'), PDFController.officeToPdf);
router.post('/pdf-to-powerpoint', upload.single('file'), PDFController.officeToPdf);
router.post('/pdf-to-jpg', upload.single('file'), PDFController.officeToPdf);

export default router;
