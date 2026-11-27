import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const systemPrompt = `Tu es l'assistant pédagogique de la plateforme Licence Gestion de Projet AI.
Ta mission est d'enseigner, accompagner, évaluer, corriger et aider l'étudiant à comprendre ses cours.
Réponds en français, avec une pédagogie claire, structurée et adaptée au niveau demandé.

RÈGLES DE FIABILITÉ DOCUMENTAIRE :
- Les extraits de PDF transmis avec la question sont les sources prioritaires pour les questions portant sur ces documents.
- Cite le nom du document et le numéro de page indiqué dans les extraits lorsqu'ils soutiennent ta réponse.
- Ne fabrique jamais une page, une citation, une définition ou un corrigé officiel.
- Si l'extrait ne permet pas de répondre, dis explicitement que l'information n'a pas été retrouvée dans le texte extrait.
- Distingue clairement le contenu du cours, ton explication pédagogique et tout complément général.
- Un corrigé généré par toi est indicatif, jamais un corrigé officiel sans preuve.
- Pour les devoirs et TP, explique les méthodes et propose un brouillon que l'étudiant doit vérifier, compléter et s'approprier.
- N'invente jamais des observations, des données de terrain, des résultats ou des expériences.
- Si un document semble être scanné et que son texte est absent, signale qu'un OCR est nécessaire.`;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "La clé OPENAI_API_KEY n'est pas configurée sur le serveur." }, { status: 503 });
    }
    const body = await request.json();
    const messages = body.messages;
    const sourcePages = body.sourcePages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) {
      return NextResponse.json({ error: "Historique de conversation invalide." }, { status: 400 });
    }
    if (sourcePages !== undefined && (!Array.isArray(sourcePages) || sourcePages.length > 80)) {
      return NextResponse.json({ error: "Sources documentaires invalides." }, { status: 400 });
    }
    const safeMessages = messages.map((message: { role?: string; content?: string }) => {
      if (!["user", "assistant"].includes(message.role ?? "") || typeof message.content !== "string") {
        throw new Error("Message invalide.");
      }
      return { role: message.role as "user" | "assistant", content: message.content.slice(0, 8000) };
    });
    const safeSources = (sourcePages ?? []).map((page: { name?: string; page?: number; text?: string }) => {
      if (typeof page.name !== "string" || typeof page.page !== "number" || typeof page.text !== "string") {
        throw new Error("Source documentaire invalide.");
      }
      return `[Document : ${page.name.slice(0, 180)} | Page PDF ${page.page}]\n${page.text.slice(0, 3000)}`;
    }).join("\n\n").slice(0, 24000);

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...(safeSources ? [{ role: "system" as const, content: "EXTRAITS DES DOCUMENTS FOURNIS POUR CETTE SESSION :\n" + safeSources }] : []),
        ...safeMessages
      ],
      temperature: 0.3,
      max_tokens: 1600
    });
    return NextResponse.json({ answer: completion.choices[0]?.message?.content || "Je n'ai pas pu produire de réponse." });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Le service pédagogique est momentanément indisponible." }, { status: 500 });
  }
}