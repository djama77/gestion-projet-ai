"use client";

import { useState } from "react";

type Mode = "plan" | "chapitre" | "relecture" | "evaluation";
type Result = { content: string; warnings: string[] };

const chapters = [
  "Proposition de thème et problématique",
  "Introduction générale",
  "1. Diagnostic stratégique et fondements du projet",
  "2. Planification du projet",
  "3. Mise en œuvre, suivi et pérennisation",
  "4. Analyse des retombées et perspectives",
  "5. Contrôle qualité et conformité (si pertinent)",
  "6. Tableau de bord et indicateurs de performance",
  "7. Évaluation du projet selon son cycle de vie",
  "8. Contribution pratique et recommandations",
  "Conclusion générale",
  "Bibliographie et annexes"
];

export default function MemoirePage() {
  const [mode, setMode] = useState<Mode>("plan");
  const [level, setLevel] = useState("Licence 3");
  const [theme, setTheme] = useState("");
  const [territory, setTerritory] = useState("Djibouti");
  const [sector, setSector] = useState("");
  const [problem, setProblem] = useState("");
  const [objective, setObjective] = useState("");
  const [duration, setDuration] = useState("36 mois");
  const [budget, setBudget] = useState("");
  const [chapter, setChapter] = useState(chapters[0]);
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  async function exportWord() {
    if (!result?.content) return;
    setExporting(true); setError("");
    try {
      const response = await fetch("/api/memoire/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: theme || "Mémoire de Licence – Gestion de Projet", content: result.content }) });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || "Export Word impossible."); }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a"); link.href = url; link.download = "memoire-licence.docx"; link.click();
      URL.revokeObjectURL(url);
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur pendant l’export Word."); }
    finally { setExporting(false); }
  }

  async function generate() {
    setLoading(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/memoire/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, level, theme, territory, sector, problem, objective, duration, budget, chapter, draft })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "La génération a échoué.");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue.");
    } finally { setLoading(false); }
  }

  return <main style={{maxWidth:1000,margin:"0 auto",padding:"28px 20px 60px",color:"#172b4d"}}>
    <a href="/" style={{color:"#2457d6",textDecoration:"none"}}>← Retour à l'accueil</a>
    <p style={{fontSize:11,letterSpacing:".16em",fontWeight:700,color:"#2457d6",marginTop:30}}>ATELIER UNIVERSITAIRE · LICENCE GESTION DE PROJET</p>
    <h1 style={{fontSize:"clamp(32px,5vw,48px)",lineHeight:1.08,margin:"12px 0"}}>Construire mon mémoire de Licence</h1>
    <p style={{color:"#66758b",lineHeight:1.7,maxWidth:760}}>Un assistant qui t’accompagne de la formulation du sujet jusqu’aux annexes : plan, rédaction, relecture, évaluation indicative sur 20 et export Word.</p>
    <section style={{background:"#fff",border:"1px solid #e4eaf2",borderRadius:16,padding:22,marginTop:24}}>
      <h2 style={{fontSize:20,marginTop:0}}>1. Informations sur ton projet</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>
        <label style={field}>Niveau<select style={control} value={level} onChange={e=>setLevel(e.target.value)}><option>Licence 1</option><option>Licence 2</option><option>Licence 3</option></select></label>
        <label style={field}>Thème / idée du projet<input style={control} value={theme} onChange={e=>setTheme(e.target.value)} placeholder="Ex. Amélioration de l'accès à l'eau..." /></label>
        <label style={field}>Territoire étudié<input style={control} value={territory} onChange={e=>setTerritory(e.target.value)} /></label>
        <label style={field}>Secteur<input style={control} value={sector} onChange={e=>setSector(e.target.value)} placeholder="Eau, santé, tourisme, emploi..." /></label>
        <label style={field}>Durée envisagée<input style={control} value={duration} onChange={e=>setDuration(e.target.value)} /></label>
        <label style={field}>Budget estimatif (facultatif)<input style={control} value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Ex. 250 000 USD ou à estimer" /></label>
      </div>
      <label style={{...field,display:"block",marginTop:14}}>Problème constaté<textarea style={{...control,minHeight:90}} value={problem} onChange={e=>setProblem(e.target.value)} placeholder="Décris la difficulté à laquelle le projet veut répondre..." /></label>
      <label style={{...field,display:"block",marginTop:14}}>Objectif principal<textarea style={{...control,minHeight:75}} value={objective} onChange={e=>setObjective(e.target.value)} placeholder="Quel changement concret souhaites-tu obtenir ?" /></label>
    </section>
    <section style={{background:"#fff",border:"1px solid #e4eaf2",borderRadius:16,padding:22,marginTop:16}}>
      <h2 style={{fontSize:20,marginTop:0}}>2. Que veux-tu préparer ?</h2>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {([["plan","Construire le plan complet"],["chapitre","Rédiger un chapitre"],["relecture","Relire et améliorer mon texte"],["evaluation","Évaluer mon mémoire /20"]] as [Mode,string][]).map(([v,label])=><button key={v} onClick={()=>setMode(v)} style={{padding:"10px 13px",borderRadius:9,border:mode===v?"2px solid #2457d6":"1px solid #dfe6f0",background:mode===v?"#eef3ff":"#fff",color:"#172b4d",fontWeight:700,cursor:"pointer"}}>{label}</button>)}
      </div>
      {mode==="chapitre" && <label style={{...field,display:"block",marginTop:16}}>Partie à rédiger<select style={control} value={chapter} onChange={e=>setChapter(e.target.value)}>{chapters.map(c=><option key={c}>{c}</option>)}</select></label>}
      {(mode==="relecture" || mode==="evaluation") && <label style={{...field,display:"block",marginTop:16}}>{mode==="evaluation" ? "Mémoire à évaluer" : "Texte à relire"}<textarea style={{...control,minHeight:160}} value={draft} onChange={e=>setDraft(e.target.value)} placeholder={mode==="evaluation" ? "Colle le mémoire complet ou une partie suffisamment développée..." : "Colle ici ton texte..."} /></label>}
      <button onClick={generate} disabled={loading} style={{marginTop:18,background:"#2457d6",color:"#fff",border:0,borderRadius:10,padding:"13px 20px",fontWeight:700,cursor:"pointer",opacity: loading ? 0.6 : 1}}>{loading?"Préparation en cours…":"Lancer l'assistant mémoire"}</button>
      {error && <p style={{color:"#b42318"}}>{error}</p>}
    </section>
    {result && <section style={{background:"#fff",border:"1px solid #e4eaf2",borderRadius:16,padding:22,marginTop:18}}>
      <h2 style={{marginTop:0}}>Résultat de l'assistant</h2>
      {result.warnings.map((w,i)=><p key={i} style={{background:"#fff8e8",padding:10,borderRadius:8,fontSize:13}}>{w}</p>)}
      <pre style={{whiteSpace:"pre-wrap",fontFamily:"inherit",lineHeight:1.75,fontSize:14}}>{result.content}</pre>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button onClick={()=>navigator.clipboard.writeText(result.content)} style={{background:"#172b4d",color:"#fff",border:0,borderRadius:8,padding:"10px 14px",cursor:"pointer"}}>Copier le texte</button><button onClick={exportWord} disabled={exporting} style={{background:"#16704a",color:"#fff",border:0,borderRadius:8,padding:"10px 14px",cursor:"pointer",opacity:exporting?0.6:1}}>{exporting?"Création du Word…":"Exporter en Word (.docx)"}</button></div>
    </section>}
    <p style={{fontSize:12,color:"#7a8798",lineHeight:1.6,marginTop:20}}>Important : l'assistant produit un brouillon pédagogique. Il ne fabrique pas de données de terrain, de sources ou de références bibliographiques. Toute donnée simulée est signalée comme telle ; les chiffres, citations et choix méthodologiques doivent être vérifiés et validés par ton encadreur.</p>
  </main>;
}

const field: React.CSSProperties = {display:"flex",flexDirection:"column",gap:7,fontSize:13,fontWeight:700};
const control: React.CSSProperties = {width:"100%",padding:"11px 12px",border:"1px solid #dfe6f0",borderRadius:8,font:"inherit",fontWeight:400,color:"#172b4d",background:"#fff"};
