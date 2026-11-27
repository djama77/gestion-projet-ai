"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };
type SourcePage = { name: string; page: number; text: string };
type ImportedDocument = { name: string; pageCount: number | null; extractedPages: number; characterCount: number; ocrRequired: boolean };

const suggestions = [
  "Explique-moi le cours simplement",
  "Prépare une fiche de révision",
  "Prépare un TP complet de gestion des risques avec données et corrigé",
  "Crée un exercice de gestion des compétences avec matrice et corrigé détaillé"
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Bienvenue dans votre espace universitaire. Importez un cours PDF ou Word pour préparer des révisions, des TP avec données simulées et des corrigés détaillés fondés sur le contenu du cours."
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sources, setSources] = useState<SourcePage[]>([]);
  const [document, setDocument] = useState<ImportedDocument | null>(null);

  async function importDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setNotice("");
    setSources([]);
    setDocument(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const endpoint = file.name.toLowerCase().endsWith(".docx") ? "/api/documents/extract-docx" : "/api/documents/extract";
      const response = await fetch(endpoint, { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Échec de l'extraction du PDF.");
      setSources(data.document.pages.map((page: { page: number; text: string }) => ({
        name: data.document.name, page: page.page, text: page.text
      })).filter((page: SourcePage) => page.text.length > 0));
      setDocument({
        name: data.document.name,
        pageCount: data.document.pageCount,
        extractedPages: data.document.extractedPages,
        characterCount: data.document.characterCount,
        ocrRequired: data.document.ocrRequired
      });
      setNotice(data.document.ocrRequired
        ? "Le texte de certaines pages est absent. Ce PDF semble nécessiter un traitement OCR ; ces pages ne seront pas utilisées dans les réponses."
        : "PDF lu. Ses extraits seront transmis au tuteur pour cette session uniquement.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'importer ce document.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function sendMessage(event?: FormEvent, preset?: string) {
    event?.preventDefault();
    const question = (preset ?? input).trim();
    if (!question || loading) return;
    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12), sourcePages: sources })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Une erreur est survenue.");
      setMessages([...next, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de contacter l'assistant.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="shell">
    <header className="topbar">
      <div className="brand-mark">GP<span>AI</span></div>
      <div><strong>LICENCE GESTION DE PROJET</strong><small>ASSISTANT PÉDAGOGIQUE INTELLIGENT</small></div>
      <span className="status">Prototype documentaire</span>
    </header>

    <section className="hero">
      <p className="eyebrow">ESPACE D’APPRENTISSAGE UNIVERSITAIRE</p>
      <h1>Apprendre, comprendre<br /><em>et progresser.</em></h1>
      <p className="intro">Importez vos supports, interrogez vos cours et préparez vos devoirs et travaux pratiques avec des explications sourcées.</p>
    </section>

    <section style={{maxWidth: 980, margin: "0 auto 24px", padding: "18px 22px", border: "1px solid #dfe6f0", borderRadius: 14, background: "#fff"}}><p className="eyebrow">ÉVALUATION ET ENTRAÎNEMENT</p><h2 style={{margin: "6px 0"}}>Examens et devoirs — Licence 1 à Licence 3</h2><p className="upload-description">Choisissez un sujet, rédigez ou importez une copie PDF, puis obtenez une correction détaillée question par question et un bulletin Word.</p><a href="/examens" style={{display:"inline-block",marginTop:8,padding:"11px 16px",borderRadius:8,background:"#2457d6",color:"#fff",fontWeight:700,textDecoration:"none"}}>Accéder au correcteur d’examens →</a></section>\n    <section className="upload-card">
      <div>
        <p className="eyebrow">BIBLIOTHÈQUE DE COURS · IMPORT PDF ET WORD</p>
        <h2>Importer un cours PDF ou Word</h2>
        <p className="upload-description">Le texte est extrait et découpé en segments afin que le tuteur puisse s’appuyer sur le contenu du cours.</p>
      </div>
      <label className="upload-button">
        {uploading ? "Lecture du document…" : "Choisir un fichier PDF ou DOCX"}
        <input type="file" accept="application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx" onChange={importDocument} disabled={uploading} />
      </label>
      {document && <div className="document-status">
        <strong>{document.name}</strong>
        <span>{document.pageCount ? document.pageCount + " pages · " : ""}{document.extractedPages} segments avec texte · {document.characterCount.toLocaleString("fr-FR")} caractères extraits</span>
        <span className={document.ocrRequired ? "warning-text" : "success-text"}>{document.ocrRequired ? "OCR nécessaire pour certaines pages" : "Extraction du texte réussie"}</span>
      </div>}
      {notice && <p className="notice">{notice}</p>}
      <p className="storage-note">Important : les documents importés sont utilisés uniquement pendant la session. Ils ne sont pas encore archivés dans une bibliothèque permanente. Les PDF scannés nécessitent un module OCR.</p>
    </section>

    <section className="chat-card">
      <div className="chat-heading"><div><span className="online-dot" /> Assistant IA</div><small>{sources.length ? "Réponses avec extraits du PDF importé" : "Importez un cours PDF ou Word pour activer les réponses documentaires"}</small></div>
      <div className="messages" aria-live="polite">
        {messages.map((message, index) => <article className={message.role === "user" ? "message user" : "message assistant"} key={index}>
          <span className="speaker">{message.role === "user" ? "VOUS" : "TUTEUR PÉDAGOGIQUE"}</span>
          <p>{message.content}</p>
        </article>)}
        {loading && <article className="message assistant"><span className="speaker">TUTEUR PÉDAGOGIQUE</span><p className="typing">Analyse du cours et préparation de la réponse…</p></article>}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="suggestions">{suggestions.map(item => <button key={item} onClick={() => sendMessage(undefined, item)} disabled={loading}>{item}</button>)}</div>
      <form className="composer" onSubmit={sendMessage}>
        <input value={input} onChange={event => setInput(event.target.value)} placeholder="Posez une question sur votre cours…" aria-label="Votre question" />
        <button type="submit" disabled={loading || !input.trim()}>{loading ? "…" : "Envoyer"}</button>
      </form>
      <p className="notice">Les réponses fondées sur le PDF utilisent les pages dont le texte a pu être extrait. Vérifiez les références et les réponses avant tout travail universitaire.</p>
    </section>
    <footer>LICENCE GESTION DE PROJET AI <span>·</span> VERSION 0.3 — IMPORT PDF / DOCX ET TP GUIDÉS</footer>
  </main>;
}