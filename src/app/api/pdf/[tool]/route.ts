import { NextRequest, NextResponse } from "next/server"; 
import { writeFile, readFile, unlink, mkdir } from "fs/promises"; 
import path from "path"; 
import fs from "fs";
import { PDFService } from '@/lib/pdf/pdf-service';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest,{ params }: { params: Promise<{ tool: string }> }) { 
  const { tool } = await params;
  const tempId = uuidv4();
  const uploadDir = path.join(process.cwd(), "uploads"); 
  const inputPaths: string[] = [];
  let resultPath = "";

  try { 
    await mkdir(uploadDir, { recursive: true }); 
    const formData = await req.formData(); 
    
    // Normalize files into an array
    const files: File[] = [];
    const filesField = formData.getAll('files');
    const fileField = formData.get('file');
    
    if (filesField.length > 0) {
      filesField.forEach(f => { if (f instanceof File) files.push(f); });
    } else if (fileField instanceof File) {
      files.push(fileField);
    }

    if (files.length === 0) { 
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 }); 
    } 
 
    // Save all uploaded files to disk for CLI processing
    for (const file of files) {
      const p = path.join(uploadDir, `${tempId}_${file.name}`);
      await writeFile(p, Buffer.from(await file.arrayBuffer()));
      inputPaths.push(p);
    }

    resultPath = path.join(uploadDir, `${tempId}_result_output`);
    let contentType = "application/pdf";
    let filename = "result.pdf";

    // Process using CLI-based PDFService
    switch (tool) {
      case 'merge':
        await PDFService.mergePDFs(inputPaths, resultPath);
        filename = "merged.pdf";
        break;
      
      case 'split':
        const splitPaths = await PDFService.splitPDF(inputPaths[0], uploadDir);
        // For now, we return the first page as a single file, or you could zip them
        // To keep it simple and working as a "binary response" pattern:
        if (splitPaths.length > 0) {
          resultPath = splitPaths[0];
          filename = "split_page_1.pdf";
          // Cleanup other split pages if any
          splitPaths.slice(1).forEach(p => fs.unlinkSync(p));
        } else {
          throw new Error("Split failed to produce pages");
        }
        break;

      case 'compress':
        await PDFService.compressPDF(inputPaths[0], resultPath);
        filename = "compressed.pdf";
        break;

      case 'jpg-to-pdf':
        await PDFService.imagesToPDF(inputPaths, resultPath);
        filename = "converted.pdf";
        break;

      case 'pdf-to-pdfa':
        await PDFService.convertToPDFA(inputPaths[0], resultPath);
        filename = "converted_pdfa.pdf";
        break;

      case 'protect-pdf':
        const protectPassword = formData.get('password') as string;
        await PDFService.protectPDF(inputPaths[0], resultPath, protectPassword);
        filename = 'protected.pdf';
        break;

      case 'unlock':
        const password = formData.get('password') as string;
        await PDFService.unlockPDF(inputPaths[0], resultPath, password);
        filename = "unlocked.pdf";
        break;

      // Office Conversions
      case 'word-to-pdf':
      case 'excel-to-pdf':
      case 'powerpoint-to-pdf':
      case 'html-to-pdf':
        resultPath = await PDFService.convertWithLibreOffice(inputPaths[0], uploadDir, 'pdf');
        filename = "converted.pdf";
        break;


      case 'txt-to-pdf':
        resultPath = await PDFService.convertTXTToPPT(inputPaths[0], uploadDir, 'pdf');
        filename = "converted.pdf";
        break;

      case 'pdf-to-word':
        resultPath = await PDFService.convertPDFToWord(inputPaths[0], uploadDir, 'docx');
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        filename = "converted.docx";
        break;

      case 'pdf-to-txt':
        resultPath = await PDFService.convertPDFToTXT(inputPaths[0], uploadDir, 'txt');
        contentType = "text/plain";
        filename = "converted.txt";
        break;
      case 'pdf-to-excel':
        resultPath = await PDFService.convertWithLibreOffice(inputPaths[0], uploadDir, 'xlsx');
        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        filename = "converted.xlsx";
        break;

      case 'pdf-to-powerpoint':
        resultPath = await PDFService.convertPDFToPPT(inputPaths[0], uploadDir, 'pptx');
        contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        filename = "converted.pptx";
        break;

      case 'tiff-to-pdf':
        resultPath = await PDFService.convertTIFFToPDF(inputPaths, uploadDir, 'pdf');
        contentType = 'application/pdf';
        filename = 'converted.pdf';
        break;

      case 'repair-pdf':
        resultPath = await PDFService.repairPDF(inputPaths[0], uploadDir, 'pdf');
        contentType = 'application/pdf';
        filename = 'converted.pdf';
        break;

    case "pdf-to-tiff": {
      const tiffFiles = await PDFService.convertPDFToTIFF(
          inputPaths[0],
          uploadDir
      );

      resultPath = path.join(uploadDir, `${tempId}_images.zip`);

      // ✅ Create ZIP
      await PDFService.createZip(tiffFiles, resultPath);

      console.log("ZIP exists:", fs.existsSync(resultPath));

      contentType = "application/zip";
      filename = "images.zip";

      // Delete TIFFs AFTER ZIP is created
      for (const file of tiffFiles) {
          if (fs.existsSync(file)) {
              await unlink(file);
          }
      }

      break;
  }

  case 'pdf-to-zip':
    resultPath = await PDFService.convertPDFToZIP(inputPaths[0], uploadDir);
    contentType = "application/zip";
    filename = "converted.zip";
    break;

      case 'pdf-to-jpg':
        resultPath = await PDFService.convertWithLibreOffice(inputPaths[0], uploadDir, 'jpg');
        contentType = "image/jpeg";
        filename = "converted.jpg";
        break;

      case 'remove-pages':
        const pagesToRemoveStr = formData.get('pagesToRemove');
        if (!pagesToRemoveStr) throw new Error("No pages specified to remove");
        const pagesToRemove = JSON.parse(pagesToRemoveStr as string);
        await PDFService.removePages(inputPaths[0], resultPath, pagesToRemove);
        filename = "pages_removed.pdf";
        break;

      // New tools
      case 'rotate-pdf':
        // For now, copy input to output as placeholder
        await fs.promises.copyFile(inputPaths[0], resultPath);
        filename = "rotated.pdf";
        break;
      case 'add-page-numbers':
        const pageNumbersOptionsStr = formData.get('pageNumbersOptions');
        if (!pageNumbersOptionsStr) throw new Error('No page numbers options');
        const pageNumbersOptions = JSON.parse(pageNumbersOptionsStr as string);
        await PDFService.addPageNumbers(inputPaths[0], resultPath, pageNumbersOptions);
        filename = "with_page_numbers.pdf";
        break;
      case 'add-watermark':
        const watermarkOptionsStr = formData.get('watermarkOptions');
        if (!watermarkOptionsStr) throw new Error('No watermark options');
        const watermarkOptions = JSON.parse(watermarkOptionsStr as string);
        await PDFService.addWatermark(inputPaths[0], resultPath, watermarkOptions);
        filename = "with_watermark.pdf";
        break;
      case 'crop-pdf':
        await fs.promises.copyFile(inputPaths[0], resultPath);
        filename = "cropped.pdf";
        break;

      default:
        throw new Error(`Tool '${tool}' not implemented`);
    }

    // Read result into buffer
    const resultBuffer = await readFile(resultPath);
 
    // Final Response
    return new NextResponse(resultBuffer, { 
      headers: { 
        "Content-Type": contentType, 
        "Content-Disposition": `attachment; filename="${filename}"`, 
      }, 
    }); 

  } catch (error: any) { 
    console.error(`Error in ${tool}:`, error); 
    return NextResponse.json({ error: error.message || "Operation failed" }, { status: 500 }); 
  } finally {
    // Comprehensive Cleanup
    try {
      for (const p of inputPaths) {
        if (fs.existsSync(p)) await unlink(p);
      }
      if (resultPath && fs.existsSync(resultPath)) {
        await unlink(resultPath);
      }
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
  }
}
