import fs from 'fs';
import Fs from 'fs/promises';
import { PDFDocument } from 'pdf-lib';
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


        // const cmd = await this.getCmd('libreoffice');
        // const outputDir = path.dirname(outputPath);
        
        // // LibreOffice convert-to pdf handles images well
        // for (const filePath of filePaths) {
        //     const command = `${cmd} --headless --convert-to pdf --outdir "${outputDir}" "${filePath}"`;
        //     await execPromise(command);
        // }

        // // If multiple images, merge the resulting PDFs
        // const pdfPaths = filePaths.map(f => path.join(outputDir, path.basename(f).replace(/\.[^/.]+$/, "") + ".pdf"));
        // if (pdfPaths.length > 1) {
        //     await this.mergePDFs(pdfPaths, outputPath);
        //     // Cleanup individual PDFs
        //     pdfPaths.forEach(p => fs.unlinkSync(p));
        // } else {
        //     fs.renameSync(pdfPaths[0], outputPath);
        // }
        
        // return outputPath;
    }

    /**
     * Universal converter using LibreOffice
     */
    // static async convertWithLibreOffice(inputPath: string, outputDir: string, format: string = 'pdf') {
    //     let cmd ='"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';
    //     if (fs.existsSync('/Applications/LibreOffice.app/Contents/MacOS/soffice')) {
    //         cmd = '/Applications/LibreOffice.app/Contents/MacOS/soffice';
    //     } else if (await this.checkCommand('soffice')) {
    //         cmd = 'soffice';
    //     }

    //     const command = `${cmd} --headless --convert-to ${format} --outdir "${outputDir}" "${inputPath}"`;
        
    //     try {
    //         await execPromise(command);
    //         const fileName = path.basename(inputPath).replace(/\.[^/.]+$/, "") + "." + format;
    //         return path.join(outputDir, fileName);
    //     } catch (error) {
    //         console.error('LibreOffice conversion failed:', error);
    //         throw new Error(`Conversion to ${format} failed. Please ensure LibreOffice is installed.`);
    //     }
    // }


    static async convertWithLibreOffice(inputPath: string, outputDir: string, format: string = 'pdf') {
        let cmd = '';

        if (process.platform === 'win32') {
            cmd =
                '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';
        } else {
            cmd = 'soffice';
        }

        const command =
            `${cmd} --headless --convert-to ${format} ` +
            `--outdir "${outputDir}" "${inputPath}"`;

        console.log(command);

        await execPromise(command);

        const outputFile =
            path.join(
                outputDir,
                path.basename(inputPath).replace(/\.[^/.]+$/, '')
                + '.' + format
            );

        return outputFile;
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

    /**
     * Unlock/Decrypt PDF using QPDF
     */
    static async unlockPDF(inputPath: string, outputPath: string) {
        const qpdf = await this.getCmd('qpdf');
        const command = `${qpdf} --decrypt "${inputPath}" "${outputPath}"`;
        
        try {
            await execPromise(command);
            return outputPath;
        } catch (error) {
            console.error('QPDF decrypt failed:', error);
            throw new Error('Unlock failed. If the file is password protected, QPDF requires the password.');
        }
    }
}
