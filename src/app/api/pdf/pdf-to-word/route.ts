import { NextRequest, NextResponse } from "next/server"; 
import { writeFile, readFile, unlink, mkdir } from "fs/promises"; 
import path from "path"; 
import { exec } from "child_process"; 
import { promisify } from "util"; 
 
const execAsync = promisify(exec); 
 
export async function POST(req: NextRequest) { 
  try { 
    const formData = await req.formData(); 
 
    const file = formData.get("file") as File; 
 
    if (!file) { 
      return NextResponse.json( 
        { error: "No file uploaded" }, 
        { status: 400 } 
      ); 
    } 
 
    const uploadDir = path.join(process.cwd(), "uploads"); 
 
    await mkdir(uploadDir, { recursive: true }); 
 
    const pdfPath = path.join( 
      uploadDir, 
      `${Date.now()}.pdf` 
    ); 
 
    const docxPath = pdfPath.replace(".pdf", ".docx"); 
 
    const bytes = await file.arrayBuffer(); 
 
    await writeFile(pdfPath, Buffer.from(bytes)); 
 
    await execAsync(` 
      libreoffice --headless \ 
      --convert-to docx \ 
      "${pdfPath}" \ 
      --outdir "${uploadDir}" 
    `); 
 
    const docxBuffer = await readFile(docxPath); 
 
    await unlink(pdfPath); 
    await unlink(docxPath); 
 
    return new NextResponse(docxBuffer, { 
      headers: { 
        "Content-Type": 
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
        "Content-Disposition": 
          'attachment; filename="converted.docx"', 
      }, 
    }); 
  } catch (error) { 
    console.error(error); 
 
    return NextResponse.json( 
      { 
        error: "Conversion failed", 
      }, 
      { 
        status: 500, 
      } 
    ); 
  } 
}
