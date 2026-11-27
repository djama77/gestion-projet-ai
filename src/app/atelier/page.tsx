"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./atelier.css";

type Task = { id: string; code: string; name: string; owner: string; start: string; end: string; progress: number; parent: string };
type BudgetLine = { id: string; category: string; description: string; planned: number; actual: number };
type Risk = { id: string; event: string; probability: number; impact: number; response: string; owner: string; status: "Ouvert" | "En cours" | "Traité" };
type RacI = { taskId: string; role: string; value: "R" | "A" | "C" | "I" | "" };

type ProjectData = { name: string; objective: string; tasks: Task[]; budget: BudgetLine[]; risks: Risk[]; raci: RacI[] };

const STORAGE_KEY = "gpai-project-workspace-v1";
const roles = ["Chef de projet", "Planificateur", "Responsable financier", "Suivi-évaluation"];
const today = new Date().toISOString().slice(0, 10);
const plusDays = (date: string, days: number) => {
  const d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const uid = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random());

const initial: ProjectData = { name: "Mon projet de gestion", objective: "", tasks: [], budget: [], risks: [], raci: [] };

function euro(value: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value);
}

export default function AtelierPage() {
  const [data, setData] = useState<ProjectData>(initial);
  const [tab, setTab] = useState("dashboard");
  const [ready, setReady] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskOwner, setTaskOwner] = useState("");
  const [taskStart, setTaskStart] = useState(today);
  const [taskEnd, setTaskEnd] = useState(plusDays(today, 7));
  const [taskParent, setTaskParent] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("Ressources humaines");
  const [budgetDescription, setBudgetDescription] = useState("");
  const [planned, setPlanned] = useState("0");
  const [actual, setActual] = useState("0");
  const [riskEvent, setRiskEvent] = useState("");
  const [probability, setProbability] = useState("3");
  const [impact, setImpact] = useState("3");
  const [riskResponse, setRiskResponse] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ProjectData>;
        setData({
          name: typeof parsed.name === "string" ? parsed.name : initial.name,
          objective: typeof parsed.objective === "string" ? parsed.objective : "",
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
          budget: Array.isArray(parsed.budget) ? parsed.budget : [],
          risks: Array.isArray(parsed.risks) ? parsed.risks : [],
          raci: Array.isArray(parsed.raci) ? parsed.raci : []
        });
      }
    } catch {
      setData(initial);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Quota navigateur : le projet reste utilisable pendant la session.
    }
  }, [data, ready]);

  const plannedTotal = useMemo(() => data.budget.reduce((sum, line) => sum + line.planned, 0), [data.budget]);
  const actualTotal = useMemo(() => data.budget.reduce((sum, line) => sum + line.actual, 0), [data.budget]);
  const averageProgress = useMemo(() => data.tasks.length ? Math.round(data.tasks.reduce((sum, task) => sum + task.progress, 0) / data.tasks.length) : 0, [data.tasks]);
  const highRisks = data.risks.filter((risk) => risk.probability * risk.impact >= 15).length;
  const projectStart = data.tasks.length ? data.tasks.map((t) => t.start).sort()[0] : today;
  const projectEnd = data.tasks.length ? data.tasks.map((t) => t.end).sort().at(-1) || today : plusDays(today, 30);
  const totalDays = Math.max(1, Math.round((new Date(projectEnd).getTime() - new Date(projectStart).getTime()) / 86400000) + 1);

  function addTask() {
    if (!taskName.trim() || taskEnd < taskStart) return;
    const task: Task = { id: uid(), code: taskParent ? `${data.tasks.find((t) => t.id === taskParent)?.code || "1"}.1` : String(data.tasks.length + 1), name: taskName.trim(), owner: taskOwner.trim(), start: taskStart, end: taskEnd, progress: 0, parent: taskParent };
    setData((current) => ({ ...current, tasks: [...current.tasks, task] }));
    setTaskName(""); setTaskOwner(""); setTaskParent("");
  }

  function addBudget() {
    const p = Number(planned), a = Number(actual);
    if (!budgetDescription.trim() || !Number.isFinite(p) || !Number.isFinite(a) || p < 0 || a < 0) return;
    setData((current) => ({ ...current, budget: [...current.budget, { id: uid(), category: budgetCategory, description: budgetDescription.trim(), planned: p, actual: a }] }));
    setBudgetDescription(""); setPlanned("0"); setActual("0");
  }

  function addRisk() {
    if (!riskEvent.trim()) return;
    setData((current) => ({ ...current, risks: [...current.risks, { id: uid(), event: riskEvent.trim(), probability: Number(probability), impact: Number(impact), response: riskResponse.trim(), owner: "", status: "Ouvert" }] }));
    setRiskEvent(""); setRiskResponse("");
  }

  function setRaci(taskId: string, role: string, value: RacI["value"]) {
    setData((current) => {
      const rest = current.raci.filter((item) => !(item.taskId === taskId && item.role === role));
      return { ...current, raci: value ? [...rest, { taskId, role, value }] : rest };
    });
  }

  function exportProject() {
    const blob = new Blob([JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "gestion-projet-ai-projet.json"; anchor.click();
    URL.revokeObjectURL(url);
  }

  function importProject(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ProjectData;
        if (typeof parsed.name !== "string" || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.budget) || !Array.isArray(parsed.risks)) throw new Error("Format");
        setData({ name: parsed.name, objective: typeof parsed.objective === "string" ? parsed.objective : "", tasks: parsed.tasks, budget: parsed.budget, risks: parsed.risks, raci: Array.isArray(parsed.raci) ? parsed.raci : [] });
      } catch {
        window.alert("Ce fichier ne correspond pas à un projet Gestion-Projet-AI valide.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  const nav = [
    ["dashboard", "Tableau de bord"], ["wbs", "WBS / Découpage"], ["gantt", "Diagramme de Gantt"],
    ["raci", "Matrice RACI"], ["budget", "Budget"], ["risks", "Risques"]
  ];

  return <main className="atelier-shell">
    <header className="atelier-top"><Link href="/" className="atelier-back">← Retour au tuteur</Link><span>GESTION-PROJET-AI <b>ATELIER</b></span><button onClick={exportProject} className="atelier-export">Exporter le projet</button></header>
    <section className="atelier-hero"><p className="atelier-eyebrow">ESPACE DE MISE EN PRATIQUE</p><h1>Atelier de gestion de projet</h1><p>Construis ton projet, organise les activités, attribue les responsabilités et suis les coûts et les risques.</p>
      <label className="atelier-field project-title">Nom du projet<input value={data.name} onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))} /></label>
      <label className="atelier-field objective-field">Objectif général<textarea rows={2} placeholder="Décris le changement attendu ou le résultat principal…" value={data.objective} onChange={(e) => setData((d) => ({ ...d, objective: e.target.value }))} /></label>
    </section>
    <div className="atelier-storage-note">Sauvegarde automatique dans ce navigateur. Pour conserver ou transférer ton travail, utilise « Exporter le projet ». La synchronisation cloud multi-appareils sera activée avec la bibliothèque et la base de données.</div>
    <nav className="atelier-tabs">{nav.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={tab === id ? "active" : ""}>{label}</button>)}</nav>

    {tab === "dashboard" && <section className="atelier-section">
      <h2>Vue d’ensemble</h2><p className="atelier-muted">Les indicateurs sont calculés à partir des données saisies dans cet atelier.</p>
      <div className="atelier-kpis">
        <article><span>Activités planifiées</span><strong>{data.tasks.length}</strong><small>{averageProgress}% d’avancement moyen</small></article>
        <article><span>Budget prévisionnel</span><strong>{euro(plannedTotal)}</strong><small>Unités monétaires à préciser</small></article>
        <article><span>Dépenses enregistrées</span><strong>{euro(actualTotal)}</strong><small>{plannedTotal ? Math.round(actualTotal / plannedTotal * 100) : 0}% du budget prévu</small></article>
        <article><span>Risques élevés</span><strong>{highRisks}</strong><small>Score probabilité × impact ≥ 15</small></article>
      </div>
      <div className="atelier-panel"><h3>Progression des activités</h3>{data.tasks.length ? data.tasks.map((task) => <div className="progress-row" key={task.id}><span>{task.code} · {task.name}</span><div><i style={{ width: task.progress + "%" }} /></div><b>{task.progress}%</b></div>) : <p className="atelier-empty">Aucune activité enregistrée. Commence par construire le WBS.</p>}</div>
      <div className="atelier-two"><div className="atelier-panel"><h3>Écart budgétaire</h3><strong className={actualTotal > plannedTotal ? "over-budget" : "within-budget"}>{euro(actualTotal - plannedTotal)}</strong><p className="atelier-muted">Dépenses réelles moins budget prévisionnel.</p></div><div className="atelier-panel"><h3>Alertes de pilotage</h3><p>{highRisks ? `${highRisks} risque(s) élevé(s) nécessitent une réponse prioritaire.` : "Aucun risque élevé détecté dans le registre actuel."}</p><p>{data.tasks.filter((t) => t.end < today && t.progress < 100).length} activité(s) en retard selon les dates et avancements saisis.</p></div></div>
    </section>}

    {tab === "wbs" && <section className="atelier-section"><h2>WBS — Structure de découpage du projet</h2><p className="atelier-muted">Décompose le projet en lots, activités et livrables vérifiables. Le code est généré automatiquement.</p>
      <div className="atelier-form-grid"><label className="atelier-field">Nom de l’activité ou du livrable<input value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="Ex. Réaliser le diagnostic initial" /></label><label className="atelier-field">Responsable<input value={taskOwner} onChange={(e) => setTaskOwner(e.target.value)} placeholder="Nom ou fonction" /></label><label className="atelier-field">Élément parent<select value={taskParent} onChange={(e) => setTaskParent(e.target.value)}><option value="">Niveau principal</option>{data.tasks.map((t) => <option key={t.id} value={t.id}>{t.code} — {t.name}</option>)}</select></label><label className="atelier-field">Début<input type="date" value={taskStart} onChange={(e) => setTaskStart(e.target.value)} /></label><label className="atelier-field">Fin<input type="date" min={taskStart} value={taskEnd} onChange={(e) => setTaskEnd(e.target.value)} /></label><button className="atelier-primary" onClick={addTask} disabled={!taskName.trim() || taskEnd < taskStart}>Ajouter au WBS</button></div>
      <div className="atelier-table-wrap"><table className="atelier-table"><thead><tr><th>Code</th><th>Activité / livrable</th><th>Responsable</th><th>Début</th><th>Fin</th><th>Avancement</th><th></th></tr></thead><tbody>{data.tasks.map((task) => <tr key={task.id}><td>{task.code}</td><td>{task.parent ? "↳ " : ""}{task.name}</td><td>{task.owner || "À attribuer"}</td><td>{task.start}</td><td>{task.end}</td><td><input aria-label={"Avancement " + task.name} className="progress-input" type="number" min="0" max="100" value={task.progress} onChange={(e) => setData((d) => ({ ...d, tasks: d.tasks.map((t) => t.id === task.id ? { ...t, progress: Math.max(0, Math.min(100, Number(e.target.value))) } : t) }))} /> %</td><td><button className="atelier-delete" onClick={() => setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== task.id && t.parent !== task.id), raci: d.raci.filter((r) => r.taskId !== task.id) }))}>Supprimer</button></td></tr>)}</tbody></table>{!data.tasks.length && <p className="atelier-empty">Le WBS est vide. Ajoute le premier lot de travail ci-dessus.</p>}</div>
    </section>}

    {tab === "gantt" && <section className="atelier-section"><h2>Diagramme de Gantt</h2><p className="atelier-muted">Visualisation des périodes planifiées à partir des dates du WBS. Les barres ne calculent pas encore les dépendances ni le chemin critique.</p>
      {data.tasks.length ? <div className="gantt-wrap"><div className="gantt-scale"><span>Activité</span><span>{projectStart}</span><span>{projectEnd}</span></div>{data.tasks.map((task) => { const offset = Math.max(0, (new Date(task.start).getTime() - new Date(projectStart).getTime()) / 86400000); const duration = Math.max(1, (new Date(task.end).getTime() - new Date(task.start).getTime()) / 86400000 + 1); return <div className="gantt-row" key={task.id}><span>{task.code} · {task.name}</span><div className="gantt-track"><i style={{ left: (offset / totalDays * 100) + "%", width: Math.min(100, duration / totalDays * 100) + "%" }}><b style={{ width: task.progress + "%" }} /></i></div></div>; })}</div> : <p className="atelier-empty">Ajoute des activités dans le WBS pour construire le Gantt.</p>}
    </section>}

    {tab === "raci" && <section className="atelier-section"><h2>Matrice des responsabilités RACI</h2><p className="atelier-muted">Pour chaque activité, désigne qui réalise (R), qui approuve et rend compte (A), qui est consulté (C) et qui est informé (I). Une seule responsabilité A est recommandée par activité.</p>
      {data.tasks.length ? <div className="atelier-table-wrap"><table className="atelier-table raci-table"><thead><tr><th>Activité</th>{roles.map((role) => <th key={role}>{role}</th>)}</tr></thead><tbody>{data.tasks.map((task) => <tr key={task.id}><td>{task.code} · {task.name}</td>{roles.map((role) => <td key={role}><select aria-label={role + " pour " + task.name} value={data.raci.find((r) => r.taskId === task.id && r.role === role)?.value || ""} onChange={(e) => setRaci(task.id, role, e.target.value as RacI["value"])}><option value="">—</option>{["R", "A", "C", "I"].map((v) => <option key={v} value={v}>{v}</option>)}</select></td>)}</tr>)}</tbody></table></div> : <p className="atelier-empty">Ajoute les activités du WBS avant de renseigner la matrice RACI.</p>}
      <p className="raci-legend"><b>R</b> Réalise · <b>A</b> Approuve / responsable final · <b>C</b> Consulté · <b>I</b> Informé</p>
    </section>}

    {tab === "budget" && <section className="atelier-section"><h2>Budget prévisionnel et suivi des dépenses</h2><p className="atelier-muted">Saisis les montants dans une même devise et précise-la dans le nom du projet si nécessaire.</p>
      <div className="atelier-form-grid"><label className="atelier-field">Catégorie<select value={budgetCategory} onChange={(e) => setBudgetCategory(e.target.value)}>{["Ressources humaines", "Équipements", "Transport", "Formation", "Communication", "Fonctionnement", "Prestations", "Autres"].map((v) => <option key={v}>{v}</option>)}</select></label><label className="atelier-field">Désignation<input value={budgetDescription} onChange={(e) => setBudgetDescription(e.target.value)} placeholder="Ex. Location de salle" /></label><label className="atelier-field">Prévision<input type="number" min="0" value={planned} onChange={(e) => setPlanned(e.target.value)} /></label><label className="atelier-field">Dépense réalisée<input type="number" min="0" value={actual} onChange={(e) => setActual(e.target.value)} /></label><button className="atelier-primary" onClick={addBudget} disabled={!budgetDescription.trim()}>Ajouter une ligne</button></div>
      <div className="atelier-kpis compact"><article><span>Total prévisionnel</span><strong>{euro(plannedTotal)}</strong></article><article><span>Total réalisé</span><strong>{euro(actualTotal)}</strong></article><article><span>Solde</span><strong>{euro(plannedTotal - actualTotal)}</strong></article></div>
      <div className="atelier-table-wrap"><table className="atelier-table"><thead><tr><th>Catégorie</th><th>Désignation</th><th>Prévision</th><th>Réalisé</th><th>Écart</th><th></th></tr></thead><tbody>{data.budget.map((line) => <tr key={line.id}><td>{line.category}</td><td>{line.description}</td><td>{euro(line.planned)}</td><td><input className="money-input" aria-label={"Dépense " + line.description} type="number" min="0" value={line.actual} onChange={(e) => setData((d) => ({ ...d, budget: d.budget.map((b) => b.id === line.id ? { ...b, actual: Math.max(0, Number(e.target.value)) } : b) }))} /></td><td>{euro(line.planned - line.actual)}</td><td><button className="atelier-delete" onClick={() => setData((d) => ({ ...d, budget: d.budget.filter((b) => b.id !== line.id) }))}>Supprimer</button></td></tr>)}</tbody></table>{!data.budget.length && <p className="atelier-empty">Aucune ligne budgétaire pour le moment.</p>}</div>
    </section>}

    {tab === "risks" && <section className="atelier-section"><h2>Registre des risques</h2><p className="atelier-muted">Évalue chaque risque selon une échelle de 1 à 5. Le score est calculé par probabilité × impact.</p>
      <div className="atelier-form-grid"><label className="atelier-field">Événement redouté<input value={riskEvent} onChange={(e) => setRiskEvent(e.target.value)} placeholder="Ex. Retard de livraison" /></label><label className="atelier-field">Probabilité<select value={probability} onChange={(e) => setProbability(e.target.value)}>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}</select></label><label className="atelier-field">Impact<select value={impact} onChange={(e) => setImpact(e.target.value)}>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}</select></label><label className="atelier-field">Réponse / mesure de mitigation<input value={riskResponse} onChange={(e) => setRiskResponse(e.target.value)} placeholder="Mesure préventive ou corrective" /></label><button className="atelier-primary" onClick={addRisk} disabled={!riskEvent.trim()}>Ajouter le risque</button></div>
      <div className="atelier-table-wrap"><table className="atelier-table"><thead><tr><th>Risque</th><th>P</th><th>I</th><th>Score</th><th>Réponse</th><th>Statut</th><th></th></tr></thead><tbody>{data.risks.map((risk) => <tr key={risk.id}><td>{risk.event}</td><td>{risk.probability}</td><td>{risk.impact}</td><td><strong className={risk.probability * risk.impact >= 15 ? "over-budget" : ""}>{risk.probability * risk.impact}</strong></td><td>{risk.response || "À définir"}</td><td><select value={risk.status} onChange={(e) => setData((d) => ({ ...d, risks: d.risks.map((r) => r.id === risk.id ? { ...r, status: e.target.value as Risk["status"] } : r) }))}><option>Ouvert</option><option>En cours</option><option>Traité</option></select></td><td><button className="atelier-delete" onClick={() => setData((d) => ({ ...d, risks: d.risks.filter((r) => r.id !== risk.id) }))}>Supprimer</button></td></tr>)}</tbody></table>{!data.risks.length && <p className="atelier-empty">Aucun risque enregistré. Ajoute les risques identifiés lors du cadrage.</p>}</div>
    </section>}

    <footer className="atelier-footer">Gestion-Projet-AI · Atelier pratique · Les indicateurs reflètent uniquement les données saisies.</footer>
    <label className="atelier-import">Importer une sauvegarde JSON<input type="file" accept="application/json,.json" onChange={importProject} /></label>
  </main>;
}
