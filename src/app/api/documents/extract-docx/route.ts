import { NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_BYTES = 12 * 1024 * 1024;
const MAX_EXTRACTED_CHARS = 140_000;
const CHUNK_SIZE = 2_200;
const MAX_CHUNKS = 80;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Aucun document Word reçu." }, { status: 400 });
    const isDocx = file.name.toLowerCase().endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!isDocx) return NextResponse.json({ error: "Importez un fichier Word .docx." }, { status: 415 });
    if (file.size === 0 || file.size > MAX_FILE_BYTES) return NextResponse.json({ error: "Le document Word doit peser au maximum 12 Mo." }, { status: 413 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    if (!text) return NextResponse.json({ error: "Aucun texte exploitable trouvé dans ce document Word." }, { status: 422 });
    if (text.length > MAX_EXTRACTED_CHARS) return NextResponse.json({ error: "Le texte extrait dépasse la limite de 140 000 caractères." }, { status: 413 });

    const paragraphs = text.split(/\n+/).map((part) => part.trim()).filter(Boolean);
    const chunks: string[] = [];
    let current = "";
    for (const paragraph of paragraphs) {
      const pieces = paragraph.match(/[\s\S]{1,2200}/g) ?? [];
      for (const piece of pieces) {
        if (current && current.length + piece.length + 2 > CHUNK_SIZE) {
          chunks.push(current);
          current = "";
        }
        current += (current ? "\n" : "") + piece;
      }
    }
    if (current) chunks.push(current);
    if (chunks.length > MAX_CHUNKS) return NextResponse.json({ error: "Le document produit trop de segments pour cette version." }, { status: 413 });

    return NextResponse.json({
      document: {
        name: file.name.slice(0, 180), pageCount: null, extractedPages: chunks.length,
        characterCount: text.length, ocrRequired: false,
        pages: chunks.map((chunk, index) => ({ page: index + 1, text: chunk }))
      },
      warnings: result.messages.map((message) => message.message),
      persistence: "session-only"
    });
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return NextResponse.json({ error: "Impossible de lire ce document Word. Vérifiez qu'il s'agit d'un fichier .docx valide et non protégé." }, { status: 422 });
  }
}
