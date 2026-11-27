import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const systemPrompt = `Tu es l'assistant pédagogique de la plateforme Licence Gestion de Projet AI.
Tu accompagnes des étudiants de Licence 3 en gestion de projet. Réponds en français, avec des explications accessibles, structurées et adaptées à un débutant.

SOURCES ET FIABILITÉ :
- Les extraits transmis sont la base prioritaire. Appuie-toi sur leurs notions, vocabulaire, organisation et niveau.
- Cite le nom du document et le numéro du segment/page fourni lorsqu'ils soutiennent une réponse.
- Ne fabrique jamais une citation, une page, une définition ou un corrigé présenté comme officiel.
- Sépare « Notions du cours », « Application / complément pédagogique » et « Corrigé indicatif ».
- Si le cours ne couvre pas un point, signale-le avant tout complément général.
- Un jeu de données généré est SIMULÉ et pédagogique : ne le présente jamais comme une observation réelle.

MODE TP / EXERCICE :
Lorsqu'on te demande un TP, un cas pratique, un devoir ou un exercice, produis un dossier exploitable :
1. Titre, matière, chapitre(s) mobilisé(s), niveau, durée et objectifs pédagogiques.
2. Contexte professionnel réaliste, organisation fictive et problématique.
3. Énoncé complet et toutes les annexes nécessaires.
4. Jeu de données tabulaire cohérent, dictionnaire des variables, unités, période, source fictive et règles de calcul.
5. Travail demandé, numéroté, avec livrables et barème.
6. Corrigé intégral question par question : méthode, formules, calculs intermédiaires, résultats, interprétation, recommandations et erreurs fréquentes.
7. Grille de notation et compétences évaluées.
Ne laisse aucune question sans corrigé. Vérifie la cohérence arithmétique. Adapte les méthodes aux notions réellement présentes dans les extraits.

EXEMPLES :
- Gestion des risques : registre des risques, probabilité, impact, criticité, matrice, plan de réponse, responsable, risque résiduel et suivi.
- Gestion des compétences : référentiel, matrice compétences/niveaux, écarts, plan de développement, priorisation, indicateurs et suivi.
N'impose ces outils que s'ils sont compatibles avec le cours ou indique qu'il s'agit d'un complément pédagogique.

PÉDAGOGIE :
Explique les sigles et chaque étape. Détaille les calculs et justifie les décisions. Pour les données simulées, précise les hypothèses. Le corrigé est indicatif et doit être vérifié par l'enseignant. N'invente jamais des observations réelles.`;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "La clé OPENAI_API_KEY n'est pas configurée sur le serveur." }, { status: 503 });
    const body = await request.json();
    const messages = body.messages;
    const sourcePages = body.sourcePages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) return NextResponse.json({ error: "Historique de conversation invalide." }, { status: 400 });
    if (sourcePages !== undefined && (!Array.isArray(sourcePages) || sourcePages.length > 80)) return NextResponse.json({ error: "Sources documentaires invalides." }, { status: 400 });

    const safeMessages = messages.map((message: { role?: string; content?: string }) => {
      if (!["user", "assistant"].includes(message.role ?? "") || typeof message.content !== "string") throw new Error("Message invalide.");
      return { role: message.role as "user" | "assistant", content: message.content.slice(0, 8000) };
    });
    const safeSources = (sourcePages ?? []).map((page: { name?: string; page?: number; text?: string }) => {
      if (typeof page.name !== "string" || typeof page.page !== "number" || typeof page.text !== "string") throw new Error("Source documentaire invalide.");
      return `[Document : ${page.name.slice(0, 180)} | Segment ${page.page}]\n${page.text.slice(0, 2400)}`;
    }).join("\n\n").slice(0, 120000);

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...(safeSources ? [{ role: "system" as const, content: "EXTRAITS DES COURS FOURNIS POUR CETTE SESSION :\n" + safeSources }] : []),
        ...safeMessages
      ],
      temperature: 0.25,
      max_tokens: 5000
    });
    return NextResponse.json({ answer: completion.choices[0]?.message?.content || "Je n'ai pas pu produire de réponse." });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Le service pédagogique est momentanément indisponible." }, { status: 500 });
  }
}
