import { NextResponse } from "next/server";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";

export const runtime = "nodejs";

function paragraphsFromText(content: string) {
  return content.split(/\r?\n/).map((line) => {
    const value = line.trim();
    if (!value) return new Paragraph({ children: [] });
    if (/^#{1,2}\s/.test(value)) {
      const title = value.replace(/^#{1,2}\s*/, "");
      return new Paragraph({ text: title, heading: value.startsWith("# ") ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2, spacing: { before: 220, after: 100 } });
    }
    if (/^[-*]\s/.test(value)) {
      return new Paragraph({ text: value.replace(/^[-*]\s*/, ""), bullet: { indent: 360 }, spacing: { after: 70 } });
    }
    if (/^\d+[.)]\s/.test(value)) {
      return new Paragraph({ children: [new TextRun(value)], spacing: { after: 90 } });
    }
    return new Paragraph({ children: [new TextRun(value)], spacing: { after: 110 }, alignment: "both" });
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { title?: unknown; content?: unknown };
    const title = typeof body.title === "string" ? body.title.trim().slice(0, 180) : "Mémoire de Licence";
    const content = typeof body.content === "string" ? body.content.trim().slice(0, 100000) : "";
    if (content.length < 20) return NextResponse.json({ error: "Le contenu à exporter est trop court." }, { status: 400 });

    const doc = new Document({
      creator: "Atelier Mémoire Licence – Gestion de Projet",
      title,
      description: "Brouillon pédagogique à vérifier et faire valider par l'encadreur.",
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: title, heading: HeadingLevel.TITLE, spacing: { after: 300 } }),
          new Paragraph({ children: [new TextRun({ text: "Brouillon pédagogique – à vérifier et faire valider par l'encadreur", italics: true, color: "666666" })], spacing: { after: 300 } }),
          ...paragraphsFromText(content),
        ],
      }],
    });
    const buffer = await Packer.toBuffer(doc);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="memoire-licence.docx"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Impossible de produire le document Word." }, { status: 500 });
  }
}
