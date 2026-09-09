import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, fileType } = body;

    if (!fileName) {
      return NextResponse.json({ error: "fileName is required" }, { status: 400 });
    }

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const storageKey = `uploads/${Date.now()}_${cleanFileName}`;

    // Direct presigned upload endpoint simulation
    const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/uploads/direct?key=${encodeURIComponent(storageKey)}`;

    return NextResponse.json({
      success: true,
      data: {
        storageKey,
        uploadUrl,
        headers: {
          "Content-Type": fileType || "application/octet-stream",
        },
      },
      message: "Presigned URL generated successfully",
    });
  } catch (error: any) {
    console.error("Presign Upload Error:", error);
    return NextResponse.json({ error: error.message || "Presign failed" }, { status: 500 });
  }
}
