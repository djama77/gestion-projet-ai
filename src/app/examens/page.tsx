"use client";

import { useState } from "react";
import Link from "next/link";
import "./examens.css";

const subjects = {
  L1: {
    title: "Fondamentaux de la gestion de projet",
    duration: "1 h 30",
    statement: "Une association souhaite organiser une journée de sensibilisation à l'environnement dans une commune. L'événement doit accueillir 150 participants dans six semaines. Le budget maximal est de 500 000 FDJ. L'équipe comprend un coordinateur, deux animateurs et un responsable logistique.\n\n1. Définir un projet et identifier trois caractéristiques du cas. (2 points)\n2. Formuler un objectif général et trois objectifs spécifiques mesurables. (3 points)\n3. Identifier les principales parties prenantes et leurs attentes. (3 points)\n4. Proposer une décomposition WBS en au moins quatre lots. (4 points)\n5. Construire un calendrier simplifié avec cinq activités, durées et responsables. (4 points)\n6. Citer quatre risques et proposer une réponse adaptée à chacun. (4 points)",
    rubric: "Question 1 : 2 pts ; Q2 : 3 pts ; Q3 : 3 pts ; Q4 : 4 pts ; Q5 : 4 pts ; Q6 : 4 pts. Total : 20."
  },
  L2: {
    title: "Planification, responsabilités, budget et risques",
    duration: "2 h",
    statement: "Une mairie lance un projet de numérisation de 2 000 dossiers administratifs en quatre mois. Le budget initial est de 4 800 000 FDJ. Les activités prévues sont : diagnostic (2 semaines), achat de matériel (2 semaines), préparation des dossiers (3 semaines), numérisation (8 semaines), contrôle qualité (3 semaines) et formation des agents (2 semaines). La numérisation dépend de la livraison du matériel et de la préparation des dossiers. À la fin du troisième mois, 1 200 dossiers sont numérisés et les dépenses atteignent 3 900 000 FDJ.\n\n1. Définir le périmètre et les livrables du projet. (2 points)\n2. Construire une séquence logique des activités et identifier les dépendances. (3 points)\n3. Proposer une matrice RACI pour quatre activités. (3 points)\n4. Calculer le taux d'avancement physique si les 2 000 dossiers ont le même poids. (2 points)\n5. Calculer le taux d'exécution budgétaire et commenter la situation. (3 points)\n6. Identifier quatre risques, évaluer leur criticité avec P×I sur une échelle de 1 à 5 et proposer des mesures. (3 points)\n7. Proposer trois indicateurs de suivi et leurs formules. (2 points)",
    rubric: "Q1 : 2 pts ; Q2 : 3 pts ; Q3 : 3 pts ; Q4 : 2 pts ; Q5 : 3 pts ; Q6 : 3 pts ; Q7 : 2 pts. Total : 20."
  },
  L3: {
    title: "Étude de cas intégrée de gestion de projet",
    duration: "3 h",
    statement: "Une structure publique veut déployer un dispositif de formation numérique dans trois régions. Le projet doit équiper trois salles, former 240 bénéficiaires et accompagner 15 formateurs sur neuf mois. Le budget approuvé est de 18 000 000 FDJ. Les acteurs comprennent le ministère, l'unité de gestion, les autorités régionales, les fournisseurs, les formateurs et les bénéficiaires. Après cinq mois, deux salles sont équipées, 90 bénéficiaires ont été formés et 10 800 000 FDJ ont été dépensés. Un fournisseur annonce un retard de six semaines. Plusieurs formateurs demandent un accompagnement supplémentaire. Les autorités régionales souhaitent un calendrier plus transparent.\n\n1. Formuler la problématique, l'objectif général et quatre résultats attendus. (2 points)\n2. Construire une WBS structurée en lots, activités et livrables. (3 points)\n3. Proposer un planning logique sur neuf mois et préciser les dépendances majeures. (2 points)\n4. Construire une matrice RACI pour cinq activités et six catégories d'acteurs. (2 points)\n5. Analyser l'avancement physique à partir des indicateurs disponibles et expliquer les limites de cette mesure. (2 points)\n6. Calculer le taux d'exécution budgétaire et discuter l'écart entre dépenses et réalisations. (2 points)\n7. Construire un registre de cinq risques avec probabilité, impact, score, responsable et réponse. (3 points)\n8. Proposer un plan de conduite du changement et de développement des compétences des formateurs. (2 points)\n9. Formuler trois recommandations de pilotage et de redevabilité. (2 points)",
    rubric: "Q1 : 2 pts ; Q2 : 3 pts ; Q3 : 2 pts ; Q4 : 2 pts ; Q5 : 2 pts ; Q6 : 2 pts ; Q7 : 3 pts ; Q8 : 2 pts ; Q9 : 2 pts. Total : 20."
  }
} as const;

type Level = keyof typeof subjects;

export default function ExamensPage() {
  const [level, setLevel] = useState<Level>("L2");
  const [statement, setStatement] = useState(subjects.L2.statement);
  const [rubric, setRubric] = useState(subjects.L2.rubric);
  const [answer, setAnswer] = useState("");
  const [copyName, setCopyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [sourceInfo, setSourceInfo] = useState("");

  function changeLevel(next: Level) {
    setLevel(next);
    setStatement(subjects[next].statement);
    setRubric(subjects[next].rubric);
    setResult("");
    setError("");
  }

  async function importPdf(file?: File) {
    if (!file) return;
    setError("");
    setSourceInfo("");
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Cette version accepte les copies PDF. Tu peux aussi coller directement ton texte.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Le PDF dépasse la limite de 12 Mo.");
      return;
    }
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/documents/extract", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Extraction impossible.");
      const pages = Array.isArray(data.document?.pages) ? data.document.pages : [];
      const extracted = pages.map((p: {page?:number;text?:string}) =>
        typeof p.text === "string" && p.text.trim() ? "[Page " + p.page + "]\n" + p.text : ""
      ).filter(Boolean).join("\n\n");
      if (!extracted.trim()) throw new Error("Aucun texte lisible n'a été extrait. Si le PDF est scanné, utilise une copie OCR ou colle le texte.");
      setAnswer(extracted.slice(0, 30000));
      setCopyName(file.name);
      setSourceInfo("Texte extrait de " + pages.length + " page(s). Vérifie les questions et les réponses avant de lancer la correction." + (data.document?.ocrRequired ? " Certaines pages semblent nécessiter un OCR." : ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de lire ce PDF.");
    }
  }


  async function downloadReport() {
    setError("");
    try {
      const response = await fetch("/api/examens/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correction: result, level, subject: subjects[level].title })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Génération du bulletin impossible.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "bulletin-correction-gestion-projet.docx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de télécharger le bulletin Word.");
    }
  }

  async function correct() {
    setError("");
    setResult("");
    if (answer.trim().length < 20) {
      setError("Ajoute une copie suffisamment complète avant de demander la correction.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/examens/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, subject: statement, rubric, answer, copyName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "La correction a échoué.");
      setResult(data.correction || "");
      setStatus(data.status || "Correction indicative");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de corriger cette copie.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="exam-shell">
    <header className="exam-top">
      <Link href="/">← Accueil</Link>
      <strong>GESTION-PROJET-AI · CORRECTEUR UNIVERSITAIRE</strong>
      <Link href="/tp-l3">TP Licence 3 ↗</Link>
    </header>
    <section className="exam-hero">
      <p className="exam-eyebrow">S'ENTRAÎNER · RÉPONDRE · SE FAIRE CORRIGER</p>
      <h1>Examens et devoirs <em>Licence</em></h1>
      <p>Choisis un sujet, rédige tes réponses ou importe ta copie PDF. Le tuteur analyse chaque question, applique le barème et explique les points obtenus et les erreurs.</p>
    </section>
    <section className="exam-panel">
      <div className="exam-heading"><div><p className="exam-eyebrow">1 · CHOISIR LE SUJET</p><h2>Mon examen d'entraînement</h2></div><span className="exam-tag">Note indicative /20</span></div>
      <div className="exam-levels">
        {(["L1","L2","L3"] as Level[]).map(item => <button key={item} className={level===item?"selected":""} onClick={()=>changeLevel(item)}><strong>{item}</strong><small>{item==="L1"?"Fondamentaux":item==="L2"?"Outils et méthodes":"Étude intégrée"}</small></button>)}
      </div>
      <div className="exam-meta"><strong>{subjects[level].title}</strong><span>Durée indicative : {subjects[level].duration} · Niveau {level}</span></div>
      <label className="exam-field">Sujet et consignes<textarea value={statement} onChange={e=>setStatement(e.target.value)} rows={12}/></label>
      <label className="exam-field">Barème de correction<textarea value={rubric} onChange={e=>setRubric(e.target.value)} rows={3}/></label>
      <p className="exam-help">Tu peux modifier le sujet et le barème pour utiliser un devoir donné par ton enseignant. Si tu disposes d'un barème officiel, recopie-le ici.</p>
    </section>
    <section className="exam-panel">
      <p className="exam-eyebrow">2 · SOUMETTRE TA COPIE</p>
      <h2>Réponses de l'étudiant</h2>
      <label className="exam-upload">＋ Importer une copie PDF<input type="file" accept=".pdf,application/pdf" onChange={e=>importPdf(e.target.files?.[0])}/></label>
      {copyName && <p className="exam-help">Fichier : {copyName}</p>}
      {sourceInfo && <p className="exam-notice">{sourceInfo}</p>}
      <label className="exam-field">Copie complète<textarea value={answer} onChange={e=>setAnswer(e.target.value)} rows={16} maxLength={30000} placeholder={"Rédige tes réponses question par question.\n\nQuestion 1 : ...\nMa réponse : ..."} /></label>
      <div className="exam-actions"><span>{answer.length.toLocaleString("fr-FR")} / 30 000 caractères</span><button className="exam-primary" disabled={loading} onClick={correct}>{loading?"Correction en cours…":"Corriger ma copie"}</button></div>
      {error && <p className="exam-error" role="alert">{error}</p>}
    </section>
    {result && <section className="exam-panel exam-result">
      <div className="exam-heading"><div><p className="exam-eyebrow">3 · RAPPORT DE CORRECTION</p><h2>Analyse de ta copie</h2></div><span className="exam-tag">{status}</span></div>
      <pre>{result}</pre>
      <div className="exam-result-actions"><button className="exam-primary" onClick={downloadReport}>Télécharger le bulletin Word (.docx)</button><button className="exam-secondary" onClick={()=>{setResult("");setStatus("");}}>Masquer le rapport</button></div>
    </section>}
    <footer className="exam-footer">Les sujets sont des exercices d'entraînement. Les notes générées sont indicatives et doivent être validées par un enseignant. N'envoie pas de données personnelles sensibles.</footer>
  </main>;
}
