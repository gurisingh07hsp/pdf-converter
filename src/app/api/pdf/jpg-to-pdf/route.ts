import { NextRequest, NextResponse } from "next/server"; 
import { writeFile, readFile, unlink, mkdir } from "fs/promises"; 
import path from "path"; 
import fs from "fs";
import { PDFService } from '@/lib/pdf/pdf-service';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) { 
  const tempId = uuidv4();
  const uploadDir = path.join(process.cwd(), "uploads"); 
  const inputPaths: string[] = [];
  let resultPath = "";

  try { 
    await mkdir(uploadDir, { recursive: true }); 
    const formData = await req.formData(); 
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) { 
      return NextResponse.json({ error: "No images uploaded" }, { status: 400 }); 
    } 
 
    for (const file of files) {
      const p = path.join(uploadDir, `${tempId}_${file.name}`);
      await writeFile(p, Buffer.from(await file.arrayBuffer()));
      inputPaths.push(p);
    }

    resultPath = path.join(uploadDir, `${tempId}_images_converted.pdf`);
    await PDFService.imagesToPDF(inputPaths, resultPath);

    const resultBuffer = await readFile(resultPath);
 
    return new NextResponse(resultBuffer, { 
      headers: { 
        "Content-Type": "application/pdf", 
        "Content-Disposition": 'attachment; filename="converted.pdf"', 
      }, 
    }); 

  } catch (error: any) { 
    console.error(`Error in jpg-to-pdf:`, error); 
    return NextResponse.json({ error: error.message || "Conversion failed" }, { status: 500 }); 
  } finally {
    try {
      for (const p of inputPaths) if (fs.existsSync(p)) await unlink(p);
      if (resultPath && fs.existsSync(resultPath)) await unlink(resultPath);
    } catch (e) {}
  }
}
