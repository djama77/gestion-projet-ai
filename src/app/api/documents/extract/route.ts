import { NextResponse } from "next/server";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_BYTES = 12 * 1024 * 1024;
const MAX_PAGES = 80;
const MAX_EXTRACTED_CHARS = 100_000;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier PDF reçu." }, { status: 400 });
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Format non pris en charge. Importez un fichier PDF." }, { status: 415 });
    }
    if (file.size === 0 || file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "Le PDF doit peser entre 1 octet et 12 Mo." }, { status: 413 });
    }

    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocument({ data, useSystemFonts: true }).promise;
    if (pdf.numPages > MAX_PAGES) {
      await pdf.destroy();
      return NextResponse.json({ error: `Le document dépasse la limite de ${MAX_PAGES} pages pour cette première version.` }, { status: 413 });
    }

    const pages: { page: number; text: string }[] = [];
    let totalChars = 0;
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      totalChars += text.length;
      pages.push({ page: pageNumber, text });
      if (totalChars > MAX_EXTRACTED_CHARS) {
        await pdf.destroy();
        return NextResponse.json({ error: "Le texte extrait dépasse la limite autorisée pour cette première version." }, { status: 413 });
      }
    }
    await pdf.destroy();

    const nonEmptyPages = pages.filter((page) => page.text.length > 0).length;
    return NextResponse.json({
      document: {
        name: file.name.slice(0, 180),
        pageCount: pages.length,
        extractedPages: nonEmptyPages,
        characterCount: totalChars,
        ocrRequired: nonEmptyPages < pages.length || totalChars < 100,
        pages
      },
      persistence: "session-only"
    });
  } catch (error) {
    console.error("PDF extraction error:", error);
    return NextResponse.json({ error: "Impossible de lire ce PDF. Il peut être protégé, endommagé ou contenir uniquement des images." }, { status: 422 });
  }
}