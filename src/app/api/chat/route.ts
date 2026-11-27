import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const systemPrompt = `Tu es l'assistant pédagogique de la plateforme Licence Gestion de Projet AI.
Ta mission est d'enseigner, accompagner, évaluer, corriger et aider l'étudiant à remettre à niveau ses connaissances pendant sa Licence.
Réponds en français, avec une pédagogie claire, structurée et adaptée au niveau demandé.
Tu peux expliquer, résumer, proposer des exemples, créer des exercices et fournir des corrigés détaillés.
RÈGLES DE FIABILITÉ :
- La bibliothèque documentaire n'est pas encore connectée dans cette version.
- Ne prétends jamais avoir consulté un cours, un fichier, une page ou une correction officielle.
- Ne présente pas les 20 modules proposés comme un programme officiel validé.
- Si une question exige le contenu exact d'un document absent, indique que le document doit être importé.
- Distingue clairement les explications pédagogiques générales des contenus tirés des documents de l'étudiant.
- N'invente pas de références, de pages, de sources ou de validation institutionnelle.`;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "La clé OPENAI_API_KEY n'est pas configurée sur le serveur." }, { status: 503 });
    }
    const body = await request.json();
    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) {
      return NextResponse.json({ error: "Historique de conversation invalide." }, { status: 400 });
    }
    const safeMessages = messages.map((message: { role?: string; content?: string }) => {
      if (!["user", "assistant"].includes(message.role ?? "") || typeof message.content !== "string") {
        throw new Error("Message invalide.");
      }
      return { role: message.role as "user" | "assistant", content: message.content.slice(0, 8000) };
    });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [{ role: "system", content: systemPrompt }, ...safeMessages],
      temperature: 0.4,
      max_tokens: 1200
    });
    return NextResponse.json({ answer: completion.choices[0]?.message?.content || "Je n'ai pas pu produire de réponse." });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Le service pédagogique est momentanément indisponible." }, { status: 500 });
  }
}