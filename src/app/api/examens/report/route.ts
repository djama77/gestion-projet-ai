import { NextResponse } from "next/server";
import { deflateRawSync } from "node:zlib";

export const runtime = "nodejs";

function xml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function crc32(data: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(files: { name: string; content: string }[]): Buffer {
  const local: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const raw = Buffer.from(file.content, "utf8");
    const compressed = deflateRawSync(raw);
    const crc = crc32(raw);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x0800, 6);
    header.writeUInt16LE(8, 8);
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(compressed.length, 18);
    header.writeUInt32LE(raw.length, 22);
    header.writeUInt16LE(name.length, 26);
    local.push(header, name, compressed);

    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0);
    directory.writeUInt16LE(20, 4);
    directory.writeUInt16LE(20, 6);
    directory.writeUInt16LE(0x0800, 8);
    directory.writeUInt16LE(8, 10);
    directory.writeUInt32LE(crc, 16);
    directory.writeUInt32LE(compressed.length, 20);
    directory.writeUInt32LE(raw.length, 24);
    directory.writeUInt16LE(name.length, 28);
    directory.writeUInt32LE(offset, 42);
    central.push(directory, name);
    offset += header.length + name.length + compressed.length;
  }
  const centralSize = central.reduce((sum, item) => sum + item.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, ...central, end]);
}

function paragraph(line: string): string {
  const trimmed = line.trim();
  if (!trimmed) return "<w:p/>";
  if (/^\|?\s*:?-{3,}/.test(trimmed)) return "";
  const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed);
  const bullet = /^[-*]\s+(.*)$/.exec(trimmed);
  const numbered = /^\d+[.)]\s+(.*)$/.exec(trimmed);
  let text = trimmed;
  let style = "Normal";
  if (heading) {
    text = heading[2];
    style = heading[1].length === 1 ? "Heading1" : heading[1].length === 2 ? "Heading2" : "Heading3";
  } else if (bullet) {
    text = "•  " + bullet[1];
  } else if (numbered) {
    text = trimmed;
  } else if (trimmed.startsWith("|")) {
    text = trimmed.split("|").filter(Boolean).map(cell => cell.trim()).join("     |     ");
  }
  text = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "");
  return "<w:p><w:pPr><w:pStyle w:val=\"" + style + "\"/></w:pPr><w:r><w:t xml:space=\"preserve\">" + xml(text) + "</w:t></w:r></w:p>";
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: "Données du rapport invalides." }, { status: 400 });
    }
    const data = body as Record<string, unknown>;
    const correction = typeof data.correction === "string" ? data.correction.slice(0, 30000).trim() : "";
    const level = typeof data.level === "string" ? data.level.slice(0, 2) : "";
    const subject = typeof data.subject === "string" ? data.subject.slice(0, 500) : "";
    if (!correction || !["L1", "L2", "L3"].includes(level)) {
      return NextResponse.json({ error: "La correction ou le niveau est manquant." }, { status: 400 });
    }

    const lines = [
      "# BULLETIN DE CORRECTION — GESTION DE PROJET",
      "",
      "Niveau : " + level + " | Date d'édition : " + new Date().toLocaleDateString("fr-FR"),
      "Sujet : " + (subject || "Sujet communiqué par l'étudiant"),
      "",
      "NOTE : Ce rapport est une évaluation pédagogique indicative générée par une IA. Il ne constitue pas une note officielle et doit être validé par un enseignant.",
      "",
      ...correction.split(/\r?\n/)
    ];
    const bodyXml = lines.map(paragraph).join("");
    const documentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
      bodyXml +
      '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>';
    const stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="21"/></w:rPr><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:style>' +
      '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:color w:val="2457D6"/><w:sz w:val="30"/></w:rPr><w:pPr><w:spacing w:before="260" w:after="120"/></w:pPr></w:style>' +
      '<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:color w:val="2457D6"/><w:sz w:val="25"/></w:rPr></w:style>' +
      '<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="23"/></w:rPr></w:style>' +
      '</w:styles>';
    const files = [
      { name: "[Content_Types].xml", content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>' },
      { name: "_rels/.rels", content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>' },
      { name: "word/document.xml", content: documentXml },
      { name: "word/styles.xml", content: stylesXml },
      { name: "word/_rels/document.xml.rels", content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' }
    ];
    const file = zip(files);
    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="bulletin-correction-gestion-projet.docx"',
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Word correction report error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Impossible de générer le bulletin Word." }, { status: 500 });
  }
}
