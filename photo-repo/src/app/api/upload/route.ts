import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export const POST = async (req: Request) => {

  const maxwidth = 600;
  const maxheight = 600;
  try {
    const formData = await req.formData(); 
    const blob = formData.get("photo") as Blob;
    const username = (formData.get("username") as string) || "anonymous";

    if (!blob) {
      return NextResponse.json({ error: "No photo uploaded" }, { status: 400 });
    }
    
    const buffer = Buffer.from(await blob.arrayBuffer());

    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    if (width > maxwidth || height > maxheight) {
      return NextResponse.json(
        { error: `Image too large. Max size: 600x600. Uploaded: ${width}x${height}` },
        { status: 400 }
      );
    }


    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    console.log("uploadsDir:", uploadsDir);
    //await fs.mkdir(uploadsDir, { recursive: true });

    const randomNumber = Math.floor(Math.random() * 1000);

    const fileName = `photo_${username}_${Date.now()}_${randomNumber}.png`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${fileName}`, username });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
