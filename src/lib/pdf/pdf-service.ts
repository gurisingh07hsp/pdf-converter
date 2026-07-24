import JSZip from "jszip";
import fs from 'fs';
import Fs from 'fs/promises';
import { PDFDocument, ColorTypes, RotationTypes, StandardFonts } from 'pdf-lib';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

/**
 * PDF Service using open-source CLI tools: Ghostscript, LibreOffice, QPDF
 */
export class PDFService {
    
    /**
     * Helper to check if a command exists
     */
    static async checkCommand(command: string): Promise<boolean> {
        try {
            await execPromise(`command -v ${command}`);
            return true;
        } catch {
            // Check common paths on macOS/Linux if not in PATH
            const commonPaths = [
                `/usr/local/bin/${command}`,
                `/usr/bin/${command}`,
                `/opt/homebrew/bin/${command}`,
                `/Applications/LibreOffice.app/Contents/MacOS/${command}`
            ];
            for (const p of commonPaths) {
                if (fs.existsSync(p)) return true;
            }
            return false;
        }
    }

    /**
     * Get the actual command path or name
     */
    static async getCmd(command: string): Promise<string> {
        if (await execPromise(`command -v ${command}`).then(() => true).catch(() => false)) {
            return command;
        }
        const commonPaths = [
            `/opt/homebrew/bin/${command}`,
            `/usr/local/bin/${command}`,
            `/usr/bin/${command}`,
            `/Applications/LibreOffice.app/Contents/MacOS/${command}`
        ];
        for (const p of commonPaths) {
            if (fs.existsSync(p)) return p;
        }
        return command; // fallback to name
    }

    /**
     * Merge multiple PDF files using pdf-lib
     */
    static async mergePDFs(filePaths: string[], outputPath: string) {
        try {
            const mergedPdf = await PDFDocument.create();

            for (const filePath of filePaths) {
                const pdfBytes = await Fs.readFile(filePath);

                const pdf = await PDFDocument.load(pdfBytes);

                const copiedPages = await mergedPdf.copyPages(
                    pdf,
                    pdf.getPageIndices()
                );

                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            const mergedPdfBytes = await mergedPdf.save();

            await Fs.writeFile(outputPath, mergedPdfBytes);

            return outputPath;
        } catch (error) {
            console.error('PDF merge failed:', error);
            throw new Error('Merge failed');
        }





        // const qpdf = await this.getCmd('qpdf');
        // const inputFiles = filePaths.map(f => `"${f}"`).join(' ');
        // const command = `${qpdf} --empty --pages ${inputFiles} -- "${outputPath}"`;
        
        // try {
        //     await execPromise(command);
        //     return outputPath;
        // } catch (error) {
        //     console.error('QPDF merge failed:', error);
        //     throw new Error('Merge failed. Ensure QPDF is installed.');
        // }
    }

    /**
     * Split a PDF into individual pages using pdf-lib
     */
    static async splitPDF(filePath: string, outputDir: string) {
        try {
            const pdfBytes = await Fs.readFile(filePath);
            const pdfDoc = await PDFDocument.load(pdfBytes);

            const outputFiles: string[] = [];

            const pageCount = pdfDoc.getPageCount();

            for (let i = 0; i < pageCount; i++) {
                const newPdf = await PDFDocument.create();

                const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);

                newPdf.addPage(copiedPage);

                const pdfBytes = await newPdf.save();

                const outputPath = path.join(
                    outputDir,
                    `split-${String(i + 1).padStart(3, '0')}.pdf`
                );

                await Fs.writeFile(outputPath, pdfBytes);

                outputFiles.push(outputPath);
            }

            return outputFiles;
        } catch (error) {
            console.error('PDF split failed:', error);
            throw new Error('Split failed');
        }




        // const qpdf = await this.getCmd('qpdf');
        // // This will create files like outputDir/result-page-001.pdf
        // const command = `${qpdf} "${filePath}" --split-pages -- "${path.join(outputDir, 'split-')}.pdf"`;
        
        // try {
        //     await execPromise(command);
        //     const files = fs.readdirSync(outputDir).filter(f => f.startsWith('split-') && f.endsWith('.pdf'));
        //     return files.map(f => path.join(outputDir, f));
        // } catch (error) {
        //     console.error('QPDF split failed:', error);
        //     throw new Error('Split failed. Ensure QPDF is installed.');
        // }
    }

    /**
     * Compress PDF using Ghostscript
     */
    static async compressPDF(inputPath: string, outputPath: string) {
        const gs = await this.getCmd('gs');
        const command = `${gs} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;
        
        try {
            await execPromise(command);
            return outputPath;
        } catch (error) {
            console.error('Ghostscript compression failed:', error);
            throw new Error('Compression failed. Ensure Ghostscript is installed.');
        }
    }

    /**
     * Convert JPG/PNG to PDF using pdf-lib
     */
    static async imagesToPDF(filePaths: string[], outputPath: string) {
        const pdfDoc = await PDFDocument.create();

        for (const filePath of filePaths) {
            const imageBytes = await Fs.readFile(filePath);

            const ext = path.extname(filePath).toLowerCase();

            let image;

            if (ext === '.png') {
                image = await pdfDoc.embedPng(imageBytes);
            } else {
                image = await pdfDoc.embedJpg(imageBytes);
            }

            const page = pdfDoc.addPage([
                image.width,
                image.height
            ]);

            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height
            });
        }

        const pdfBytes = await pdfDoc.save();

        await Fs.writeFile(outputPath, pdfBytes);

        return outputPath;
    }

    /**
     * Universal converter using LibreOffice
     */
    static async convertPDFToPPT(inputPath: string, outputDir: string, format: string = 'pdf') {
        let cmd = '';

        if (process.platform === 'win32') {
            cmd = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';
        } else {
            // Try libreoffice first, then soffice
            try {
                cmd = await this.getCmd('libreoffice');
            } catch (e) {
                cmd = await this.getCmd('soffice');
            }
        }
        const command = `${cmd} --infilter="impress_pdf_import" --convert-to pptx:"Impress MS PowerPoint 2007 XML" --outdir ${outputDir} ${inputPath}`;
        // const command = `${cmd} --headless --convert-to ${format} --outdir "${outputDir}" "${inputPath}"`;
        
        try {
            await execPromise(command);
            const fileName = path.basename(inputPath).replace(/\.[^/.]+$/, "") + "." + format;
            return path.join(outputDir, fileName);
        } catch (error) {
            console.error('LibreOffice conversion failed:', error);
            throw new Error(`Conversion to ${format} failed. Please ensure LibreOffice is installed.`);
        }
    }

    static async createZip(files: string[], zipPath: string) {
      const zip = new JSZip();

    for (const file of files) {
        const data = await Fs.readFile(file);
        zip.file(path.basename(file), data);
    }

    const buffer = await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9,
        },
    });

    await Fs.writeFile(zipPath, buffer);

    return zipPath;
    }

    static async convertTIFFToPDF(
        inputPaths: string[],
        outputDir: string,
        format: string = "pdf"
    ) {
        const gs = await this.getCmd("gs");

        const outputPath = path.join(outputDir, `converted.${format}`);

        // Sort pages (Page-1.tif, Page-2.tif...)
        const sortedFiles = inputPaths.sort((a, b) => {
            const pageA = parseInt(path.basename(a).match(/\d+/)?.[0] || "0");
            const pageB = parseInt(path.basename(b).match(/\d+/)?.[0] || "0");
            return pageA - pageB;
        });

        const inputFiles = sortedFiles
            .map(file => `"${file}"`)
            .join(" ");

        const command =
            `${gs} ` +
            `-dSAFER ` +
            `-dBATCH ` +
            `-dNOPAUSE ` +
            `-sDEVICE=pdfwrite ` +
            `-o "${outputPath}" ` +
            `${inputFiles}`;

        console.log(command);

        try {
            await execPromise(command);

            if (!fs.existsSync(outputPath)) {
                throw new Error("PDF was not created.");
            }

            return outputPath;
        } catch (err) {
            console.error("Ghostscript TIFF->PDF failed:", err);
            throw new Error("TIFF to PDF conversion failed.");
        }
    }

    static async convertPDFToTIFF(inputPath: string, outputDir: string, format: string = 'pdf') {
        const gs = await this.getCmd('gs');
    // const gs =
    //     process.platform === "win32"
    //         ? '"C:\\Program Files\\gs\\gs10.07.1\\bin\\gswin64c.exe"'
    //         : "gs";

    const outputPattern = path.join(outputDir, "Page-%d.tif");

        const command =
            `${gs} ` +
            `-dSAFER -dBATCH -dNOPAUSE ` +
            `-r300 ` +
            `-sDEVICE=tiffscaled24 ` +
            `-sCompression=lzw ` +
            `-dTextAlphaBits=4 ` +
            `-dGraphicsAlphaBits=4 ` +
            `-sOutputFile="${outputPattern}" ` +
            `-f "${inputPath}"`;

        await execPromise(command);

        const tiffFiles = fs
            .readdirSync(outputDir)
            .filter(file => file.toLowerCase().endsWith(".tif"))
            .sort()
            .map(file => path.join(outputDir, file));

        if (tiffFiles.length === 0) {
            throw new Error("No TIFF files generated.");
        }

        return tiffFiles;
    }

    static async repairPDF(
        inputPath: string,
        outputDir: string,
        format: string = "pdf"
    ) {
        const gs = await this.getCmd("gs");

        // Create output filename
        const fileName =
            path.basename(inputPath, path.extname(inputPath)) +
            `_repaired.${format}`;

        const outputPath = path.join(outputDir, fileName);

        const command =
            `${gs} ` +
            `-dSAFER ` +
            `-dBATCH ` +
            `-dNOPAUSE ` +
            `-sDEVICE=pdfwrite ` +
            `-dPDFSETTINGS=/prepress ` +
            `-sOutputFile="${outputPath}" ` +
            `"${inputPath}"`;

        console.log("Repair command:", command);

        try {
            await execPromise(command);

            if (!fs.existsSync(outputPath)) {
                throw new Error("Repaired PDF was not created.");
            }

            return outputPath;
        } catch (error) {
            console.error("Ghostscript repair failed:", error);
            throw new Error("PDF repair failed.");
        }
    }



    static async convertWithLibreOffice(inputPath: string, outputDir: string, format: string = 'pdf') {
        let cmd = '';

        if (process.platform === 'win32') {
            cmd = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';
        } else {
            // Try libreoffice first, then soffice
            try {
                cmd = await this.getCmd('libreoffice');
            } catch (e) {
                cmd = await this.getCmd('soffice');
            }
        }

        // Create a temporary subdirectory to avoid conflicting with existing files
        const tempConvertDir = path.join(outputDir, 'temp_convert_' + Date.now());
        await fs.promises.mkdir(tempConvertDir, { recursive: true });

        const command = `${cmd} --headless --convert-to ${format} "${inputPath}" --outdir "${tempConvertDir}"`;

        console.log('Running command:', command);
        console.log('Input path exists:', fs.existsSync(inputPath));
        console.log('Temp convert dir:', tempConvertDir);

        try {
            const { stdout, stderr } = await execPromise(command, { timeout: 60000 });
            console.log('LibreOffice stdout:', stdout);
            console.error('LibreOffice stderr:', stderr);
        } catch (error) {
            console.error('LibreOffice command failed:', error);
        }

        // Wait for file to be written
        await new Promise(r => setTimeout(r, 2000));

        // Check what files were created
        const files = fs.readdirSync(tempConvertDir);
        console.log('Files in temp convert dir:', files);

        // Find our converted file
        const convertedFiles = files.filter(f => f.endsWith('.' + format));
        
        if (convertedFiles.length === 0) {
            await fs.promises.rm(tempConvertDir, { recursive: true });
            throw new Error('LibreOffice conversion did not produce an output file');
        }

        // Move file to output dir
        const tempOutputPath = path.join(tempConvertDir, convertedFiles[0]);
        const finalOutputPath = path.join(outputDir, convertedFiles[0]);
        await fs.promises.rename(tempOutputPath, finalOutputPath);

        // Cleanup temp dir
        await fs.promises.rm(tempConvertDir, { recursive: true });

        console.log('Final output path:', finalOutputPath);
        return finalOutputPath;
    }



      static async convertTXTToPPT(inputPath: string, outputDir: string, format: string = 'pdf') {
        let cmd = '';

        if (process.platform === 'win32') {
            cmd = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';
        } else {
            // Try libreoffice first, then soffice
            try {
                cmd = await this.getCmd('libreoffice');
            } catch (e) {
                cmd = await this.getCmd('soffice');
            }
        }

        const command = `${cmd} --headless --invisible --convert-to pdf:writer_pdf_Export --outdir ${outputDir} ${inputPath}`;
        
        try {
            await execPromise(command);
            const fileName = path.basename(inputPath).replace(/\.[^/.]+$/, "") + "." + format;
            return path.join(outputDir, fileName);
        } catch (error) {
            console.error('LibreOffice conversion failed:', error);
            throw new Error(`Conversion to ${format} failed. Please ensure LibreOffice is installed.`);
        }
    }

      static async convertPDFToTXT(inputPath: string, outputDir: string, format: string = 'txt') {
       const gs = await this.getCmd('gs');
        // const gs =
        //     process.platform === "win32"
        //     ? '"C:\\Program Files\\gs\\gs10.07.1\\bin\\gswin64c.exe"'
        //     : "gs";
            const fileName = path.basename(inputPath).replace(/\.[^/.]+$/, "") + "." + format;
            const outputPath = path.join(outputDir, fileName);

        const command = `${gs} -sDEVICE=txtwrite -dNOPAUSE -dBATCH -q -dTextFormat=3 \
                            -sOutputFile=${outputPath} \
                            -f ${inputPath}`;
        
          try {
            await execPromise(command);

            if (!fs.existsSync(outputPath)) {
                throw new Error(`Expected output file was not created: ${outputPath}`);
            }

            return outputPath;
        } catch (error) {
            console.error('GS conversion failed:', error);
            throw new Error(`Conversion to ${format} failed. Please ensure GS is installed.`);
        }
    }

    static async convertPDFToWord(inputPath: string, outputDir: string, format: string = 'docx'){
        const gs = await this.getCmd('gs');

        console.log("GS command:", gs);

        const { stdout: whichOut } = await execPromise("which gs");
        console.log("which gs:", whichOut);

        const { stdout: versionOut } = await execPromise(`${gs} --version`);
        console.log("GS Version:", versionOut);

        const { stdout: helpOut } = await execPromise(`${gs} -h | grep docx || true`);
        console.log("GS Devices:", helpOut);

            const fileName = path.basename(inputPath).replace(/\.[^/.]+$/, "") + "." + format;
            const outputPath = path.join(outputDir, fileName);

            const command = `${gs} -sDEVICE=docxwrite -o "${outputPath}" "${inputPath}"`;
        
        try {
            await execPromise(command);

            if (!fs.existsSync(outputPath)) {
                throw new Error(`Expected output file was not created: ${outputPath}`);
            }

            return outputPath;
        } catch (error: any) {
            console.error("Command:", command);
            console.error("stdout:", error.stdout);
            console.error("stderr:", error.stderr);
            throw error;
        }
    }


    /**
     * Convert PDF to PDF/A using Ghostscript
     */
    static async convertToPDFA(inputPath: string, outputPath: string) {
        const gs = await this.getCmd('gs');
        const command = `${gs} -dPDFA -dBATCH -dNOPAUSE -dNOOUTERSAVE -dUseCIEColor -sProcessColorModel=DeviceCMYK -sDEVICE=pdfwrite -sPDFACompatibilityPolicy=1 -sOutputFile="${outputPath}" "${inputPath}"`;
        
        try {
            await execPromise(command);
            return outputPath;
        } catch (error) {
            console.error('Ghostscript PDF/A conversion failed:', error);
            throw new Error('PDF/A conversion failed. Ensure Ghostscript is installed.');
        }
    }

    static async protectPDF(inputPath: string,outputPath: string, password?: string) {
        const qpdf = await this.getCmd('qpdf');

        const command = `${qpdf} --encrypt "${password}" "${password}" 256 -- "${inputPath}" "${outputPath}"`;

        try {
            await execPromise(command);
            return outputPath;
        } catch (error) {
            console.error('QPDF ecrypt failed:', error);
            throw new Error('Protect failed.');
        }
    }


    static async unlockPDF(inputPath: string,outputPath: string, password?: string) {
        const qpdf = await this.getCmd('qpdf');

        const command = password
            ? `${qpdf} --password="${password}" --decrypt "${inputPath}" "${outputPath}"`
            : `${qpdf} --decrypt "${inputPath}" "${outputPath}"`;

        try {
            await execPromise(command);
            return outputPath;
        } catch (error) {
            console.error('QPDF decrypt failed:', error);
            throw new Error('Unlock failed.');
        }
    }


    static async convertPDFToZIP(
        inputPath: string,
        outputDir: string
    ): Promise<string> {

        const zip = new JSZip();

        // Read PDF
        const pdfBuffer = await fs.promises.readFile(inputPath);

        // Add PDF to ZIP
        zip.file(path.basename(inputPath), pdfBuffer);

        // Generate ZIP
        const zipBuffer = await zip.generateAsync({
            type: "nodebuffer",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9,
            },
        });

        // Output path
        const zipPath = path.join(
            outputDir,
            `${path.basename(inputPath, path.extname(inputPath))}.zip`
        );

        // Save ZIP
        await fs.promises.writeFile(zipPath, zipBuffer);

        if (!fs.existsSync(zipPath)) {
            throw new Error("ZIP file was not created.");
        }

        return zipPath;
    }

    /**
     * Remove specific pages from a PDF using pdf-lib
     */
    static async removePages(inputPath: string, outputPath: string, pagesToRemove: number[]) {
        try {
            const pdfBytes = await Fs.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const newPdfDoc = await PDFDocument.create();
            const totalPages = pdfDoc.getPageCount();

            // Create a set for O(1) lookups
            const pagesToRemoveSet = new Set(pagesToRemove.map(p => p - 1)); // convert to 0-indexed

            for (let i = 0; i < totalPages; i++) {
                if (!pagesToRemoveSet.has(i)) {
                    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
                    newPdfDoc.addPage(copiedPage);
                }
            }

            const newPdfBytes = await newPdfDoc.save();
            await Fs.writeFile(outputPath, newPdfBytes);

            return outputPath;
        } catch (error) {
            console.error('Remove pages failed:', error);
            throw new Error('Remove pages failed');
        }
    }

    /**
     * Add page numbers to a PDF
     */
    static async addPageNumbers(
        inputPath: string,
        outputPath: string,
        options: {
            position: string;
            margin: number;
            startNumber: number;
            fromPage: number;
            toPage: number;
        }
    ) {
        try {
            const pdfBytes = await Fs.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            const totalPages = pages.length;
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            for (let i = 0; i < totalPages; i++) {
                const page = pages[i];
                const pageNumber = options.startNumber + i;
                const pageNumber1Based = i + 1;

                // Check if page is in range
                if (pageNumber1Based >= options.fromPage && pageNumber1Based <= options.toPage) {
                    const { width, height } = page.getSize();
                    const fontSize = 12;
                    const text = `${pageNumber}`;
                    const margin = options.margin || 20;
                    const textWidth = font.widthOfTextAtSize(text, fontSize);

                    // Position mapping
                    let x = 0;
                    let y = 0;

                    switch (options.position) {
                        case 'top-left':
                            x = margin;
                            y = height - margin;
                            break;
                        case 'top-center':
                            x = (width - textWidth) / 2;
                            y = height - margin;
                            break;
                        case 'top-right':
                            x = width - margin - textWidth;
                            y = height - margin;
                            break;
                        case 'left-center':
                            x = margin;
                            y = height / 2;
                            break;
                        case 'center':
                            x = (width - textWidth) / 2;
                            y = height / 2;
                            break;
                        case 'right-center':
                            x = width - margin - textWidth;
                            y = height / 2;
                            break;
                        case 'bottom-left':
                            x = margin;
                            y = margin;
                            break;
                        case 'bottom-center':
                            x = (width - textWidth) / 2;
                            y = margin;
                            break;
                        case 'bottom-right':
                            x = width - margin - textWidth;
                            y = margin;
                            break;
                        default:
                            x = (width - textWidth) / 2;
                            y = margin;
                    }

                    page.drawText(text, {
                        x: x,
                        y: y,
                        size: fontSize,
                        font: font,
                        color: { type: ColorTypes.RGB, red: 0, green: 0, blue: 0 },
                        opacity: 1,
                    });
                }
            }

            const newPdfBytes = await pdfDoc.save();
            await Fs.writeFile(outputPath, newPdfBytes);
            return outputPath;
        } catch (error) {
            console.error('Add page numbers failed:', error);
            throw new Error('Add page numbers failed');
        }
    }

    /**
     * Add watermark to a PDF
     */
    static async addWatermark(
        inputPath: string,
        outputPath: string,
        options: {
            type: 'text' | 'image';
            text?: string;
            imagePath?: string;
            position: string;
            margin: number;
            rotation: number;
            transparency: number;
            fromPage: number;
            toPage: number;
        }
    ) {
        try {
            const pdfBytes = await Fs.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            const totalPages = pages.length;
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            for (let i = 0; i < totalPages; i++) {
                const page = pages[i];
                const pageNumber1Based = i + 1;

                // Check if page is in range
                if (pageNumber1Based >= options.fromPage && pageNumber1Based <= options.toPage) {
                    const { width, height } = page.getSize();
                    const fontSize = 50;
                    const text = options.text || '';
                    const margin = options.margin || 20;
                    const textWidth = font.widthOfTextAtSize(text, fontSize);

                    // Calculate position
                    let x = 0;
                    let y = 0;

                    switch (options.position) {
                        case 'top-left':
                            x = margin;
                            y = height - margin;
                            break;
                        case 'top-center':
                            x = (width - textWidth) / 2;
                            y = height - margin;
                            break;
                        case 'top-right':
                            x = width - margin - textWidth;
                            y = height - margin;
                            break;
                        case 'left-center':
                            x = margin;
                            y = height / 2;
                            break;
                        case 'center':
                            x = (width - textWidth) / 2;
                            y = height / 2;
                            break;
                        case 'right-center':
                            x = width - margin - textWidth;
                            y = height / 2;
                            break;
                        case 'bottom-left':
                            x = margin;
                            y = margin;
                            break;
                        case 'bottom-center':
                            x = (width - textWidth) / 2;
                            y = margin;
                            break;
                        case 'bottom-right':
                            x = width - margin - textWidth;
                            y = margin;
                            break;
                        default:
                            x = (width - textWidth) / 2;
                            y = height / 2;
                    }

                    if (options.type === 'text' && text) {
                        page.drawText(text, {
                            x: x,
                            y: y,
                            size: fontSize,
                            font: font,
                            color: { type: ColorTypes.RGB, red: 0.5, green: 0.5, blue: 0.5 },
                            opacity: options.transparency || 0.3,
                            rotate: { type: RotationTypes.Degrees, angle: options.rotation || 0 },
                        });
                    } else if (options.type === 'image' && options.imagePath) {
                        // Handle image watermark if needed
                        // For now, let's just support text watermark
                    }
                }
            }

            const newPdfBytes = await pdfDoc.save();
            await Fs.writeFile(outputPath, newPdfBytes);
            return outputPath;
        } catch (error) {
            console.error('Add watermark failed:', error);
            throw new Error('Add watermark failed');
        }
    }
}
