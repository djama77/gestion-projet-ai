import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({error:"Le service IA n'est pas configuré (OPENAI_API_KEY)."}, {status:503});
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({error:"Requête invalide."},{status:400});
    const b = body as Record<string, unknown>;
    const mode = str(b.mode, 20);
    const level = str(b.level, 20);
    const theme = str(b.theme, 500);
    const territory = str(b.territory, 200);
    const sector = str(b.sector, 200);
    const problem = str(b.problem, 3000);
    const objective = str(b.objective, 2000);
    const duration = str(b.duration, 100);
    const budget = str(b.budget, 100);
    const chapter = str(b.chapter, 180);
    const draft = str(b.draft, 18000);
    if (!["plan","chapitre","relecture"].includes(mode) || !["Licence 1","Licence 2","Licence 3"].includes(level)) return NextResponse.json({error:"Mode ou niveau invalide."},{status:400});
    if (mode!=="relecture" && theme.length<8) return NextResponse.json({error:"Précise un thème de projet (au moins quelques mots)."}, {status:400});
    if (mode==="relecture" && draft.length<30) return NextResponse.json({error:"Colle un texte suffisamment développé pour permettre une relecture."},{status:400});

    const system = [
      "Tu es un directeur pédagogique et spécialiste de la gestion de projet qui accompagne un étudiant de Licence en français clair.",
      "Tu t'inspires de la structure du mini-mémoire modèle fourni par l'étudiant, sans copier ses phrases, ses données, son sujet touristique ni ses erreurs.",
      "Le modèle principal comporte : pages préliminaires ; introduction et problématique ; diagnostic (contexte, besoins, SWOT, SMART, cadre logique, risques) ; planification (gouvernance, parties prenantes, coût-délai-qualité, WBS/livrables, chronogramme, budget/financement) ; mise en œuvre, suivi-évaluation, pérennisation ; retombées, recommandations, conclusion et annexes. Trois références complémentaires enrichissent la méthode sans imposer leur niveau de complexité : (1) étude Licence 3 de suivi et contrôle qualité de travaux routiers : présentation du projet, procédures qualité, contrôles, non-conformités et recommandations ; (2) mémoire universitaire sur mesure de performance et tableau de bord : définition des KPI, fiches indicateurs, collecte, visualisation et aide à la décision ; (3) mémoire sur méthodes d’évaluation au cycle de vie : évaluation ex ante, suivi en cours d’exécution, évaluation finale, critères de succès et limites. Pour ces références, n’invente pas de détails bibliographiques ni de résultats non fournis. Adapte les apports au sujet : qualité pour travaux/infrastructures, KPI pour pilotage, cycle d’évaluation pour tout projet.",
      "Le mémoire doit être cohérent de bout en bout : problème, objectifs, résultats, activités, indicateurs, calendrier, responsabilités et budget doivent se correspondre.",
      "N'invente jamais des statistiques réelles, enquêtes, entretiens, textes juridiques, citations, sources bibliographiques, résultats observés, partenaires engagés ou financements acquis. Quand une information manque, écris [DONNÉE À COLLECTER] ou propose une hypothèse explicitement signalée.",
      "Les données fictives ou simulées doivent être marquées SIMULÉES et ne peuvent pas être présentées comme des résultats de terrain. Distingue clairement diagnostic documentaire, enquête réellement menée et hypothèses de conception.",
      "Adapte le niveau et la profondeur à Licence 1, 2 ou 3. Explique les concepts et outils, évite le jargon inutile, rédige dans un style universitaire naturel et non artificiellement emphatique.",
      "Pour les budgets, explicite les hypothèses, les unités, les quantités, les coûts unitaires et les totaux ; vérifie les additions. Pour les indicateurs, précise définition, formule, unité, source, fréquence et responsable.",
      "Ne prétends pas que le projet est déjà exécuté : utilise le futur ou le conditionnel pour les actions prévues et distingue résultats attendus et résultats mesurés.",
      "Ne présente pas les données anciennes du modèle comme actuelles. Toutes les données contextuelles devront être vérifiées à partir de sources fiables et datées.",
      "Termine les productions par une section 'Points à vérifier avec l'étudiant et l'encadreur'."
    ].join("\n");
    const context = [
      "MODE : "+mode, "NIVEAU : "+level, "THÈME : "+theme, "TERRITOIRE : "+territory,
      "SECTEUR : "+sector, "PROBLÈME : "+problem, "OBJECTIF : "+objective,
      "DURÉE : "+duration, "BUDGET : "+(budget||"à estimer avec hypothèses"), "PARTIE : "+chapter,
      "TEXTE À RELIRE : "+draft
    ].join("\n");
    const task = mode==="plan"
      ? "Construis un plan détaillé et personnalisé du mémoire, du préliminaire aux annexes. Pour chaque chapitre et sous-section, explique ce qu'il faut écrire, quelles données sont nécessaires, quels outils de gestion de projet mobiliser et quels tableaux/annexes préparer. Formule une problématique, une question centrale, un objectif général, 3 à 5 objectifs spécifiques et des résultats attendus cohérents. Termine par une feuille de route de rédaction."
      : mode==="chapitre"
      ? "Rédige un brouillon substantiel et structuré de la partie demandée, avec titres numérotés, transitions, tableaux utiles en format Markdown si nécessaire, et explications accessibles. Signale les données à collecter avec des marqueurs. Assure la cohérence avec le thème et le niveau."
      : "Relis le texte fourni comme un encadreur : diagnostic des points forts/faibles, corrections de fond et de forme, cohérence méthodologique, risques d'invention, propositions de reformulation. Fournis une version révisée complète puis une liste des modifications importantes.";
    const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    const completion = await client.chat.completions.create({
      model:process.env.OPENAI_MODEL||"gpt-4.1-mini",
      temperature:0.25,
      max_tokens:6500,
      messages:[{role:"system",content:system},{role:"user",content:context+"\n\nCONSIGNE :\n"+task}]
    });
    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) return NextResponse.json({error:"Aucun contenu n'a été généré."},{status:502});
    const warnings = ["Brouillon pédagogique : fais valider le plan et les choix méthodologiques par ton encadreur.",
      "Les éléments entre crochets doivent être documentés. Aucun chiffre, entretien ou résultat de terrain ne doit être inventé.",
      "Vérifie les références bibliographiques et l'actualité des données avant dépôt."];
    return NextResponse.json({content,warnings});
  } catch (error) {
    console.error("Memoire generator error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({error:"La génération du mémoire a échoué. Vérifie la configuration IA puis réessaie."},{status:500});
  }
}
