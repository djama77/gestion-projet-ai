"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };
type SourcePage = { name: string; page: number; text: string };
type ImportedDocument = {
  name: string;
  pageCount: number;
  extractedPages: number;
  characterCount: number;
  ocrRequired: boolean;
};
type StudyLevel = "L1" | "L2" | "L3";
type StudyMode = "explain" | "summary" | "quiz" | "assignment" | "tp" | "method";

const STORAGE_KEY = "gpai-study-session-v1";

const modes: { id: StudyMode; label: string; description: string; prompt: string }[] = [
  { id: "explain", label: "Expliquer un cours", description: "Comprendre une notion pas à pas", prompt: "Explique-moi le cours simplement, étape par étape, avec un exemple concret." },
  { id: "summary", label: "Fiche de révision", description: "Notions, définitions et points clés", prompt: "Prépare une fiche de révision structurée à partir du cours." },
  { id: "quiz", label: "Quiz interactif", description: "Tester les connaissances", prompt: "Prépare un quiz de 5 questions à partir du cours. Pose les questions une par une et attends mes réponses avant de corriger." },
  { id: "assignment", label: "Devoir corrigé", description: "Méthode et correction indicative", prompt: "Aide-moi à traiter un devoir : explique la méthode, les étapes et propose une correction indicative." },
  { id: "tp", label: "Travaux pratiques", description: "Appliquer les outils de gestion", prompt: "Aide-moi à préparer un travail pratique à partir de ce cours, avec les étapes, les livrables et une grille de vérification." },
  { id: "method", label: "Méthodes et outils", description: "Gantt, RACI, WBS, budget et risques", prompt: "Apprends-moi à utiliser les outils de gestion de projet liés à ce sujet, avec un exemple progressif." }
];

const starterQuestions = [
  "Explique la notion principale de ce chapitre.",
  "Donne-moi les définitions essentielles.",
  "Quels sont les points à mémoriser pour l'examen ?"
];

function readSavedSession(): { level: StudyLevel; mode: StudyMode; messages: Message[] } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!Array.isArray(value.messages)) return null;
    const messages = value.messages.filter((item: unknown): item is Message =>
      !!item && typeof item === "object" &&
      ["user", "assistant"].includes((item as Message).role) &&
      typeof (item as Message).content === "string"
    ).slice(-30);
    return {
      level: ["L1", "L2", "L3"].includes(value.level) ? value.level : "L1",
      mode: modes.some((mode) => mode.id === value.mode) ? value.mode : "explain",
      messages
    };
  } catch {
    return null;
  }
}

export default function Home() {
  const saved = useMemo(() => typeof window === "undefined" ? null : readSavedSession(), []);
  const [level, setLevel] = useState<StudyLevel>(saved?.level ?? "L1");
  const [mode, setMode] = useState<StudyMode>(saved?.mode ?? "explain");
  const [messages, setMessages] = useState<Message[]>(saved?.messages?.length ? saved.messages : [{
    role: "assistant",
    content: "Bienvenue dans ton espace de formation. Choisis ton niveau et ton mode d’apprentissage, puis importe un support PDF pour obtenir des explications qui s’appuient sur les pages du document."
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sources, setSources] = useState<SourcePage[]>([]);
  const [document, setDocument] = useState<ImportedDocument | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ level, mode, messages: messages.slice(-30) }));
    } catch {
      // La session continue même si le navigateur bloque le stockage.
    }
  }, [level, mode, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function importPdf(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setNotice("");
    setSources([]);
    setDocument(null);
    try {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        throw new Error("Seuls les fichiers PDF sont acceptés dans cette version.");
      }
      if (file.size > 12 * 1024 * 1024) {
        throw new Error("Le PDF dépasse la limite de 12 Mo.");
      }
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/documents/extract", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Échec de l'extraction du PDF.");
      if (!data.document || !Array.isArray(data.document.pages)) {
        throw new Error("Le serveur a retourné un résultat documentaire invalide.");
      }
      const extracted = data.document.pages
        .filter((page: { page?: number; text?: string }) => Number.isInteger(page.page) && typeof page.text === "string" && page.text.trim())
        .map((page: { page: number; text: string }) => ({
          name: String(data.document.name || file.name).slice(0, 180),
          page: page.page,
          text: page.text.slice(0, 3000)
        }));
      setSources(extracted);
      setDocument({
        name: String(data.document.name || file.name).slice(0, 180),
        pageCount: Number(data.document.pageCount) || 0,
        extractedPages: Number(data.document.extractedPages) || extracted.length,
        characterCount: Number(data.document.characterCount) || 0,
        ocrRequired: Boolean(data.document.ocrRequired)
      });
      setNotice(data.document.ocrRequired
        ? "Extraction partielle : certaines pages semblent scannées et ne sont pas disponibles pour le tuteur. Un traitement OCR sera nécessaire."
        : "PDF lu avec succès. Les extraits sont utilisés temporairement pour cette session ; le document n'est pas archivé.");
      setMessages((current) => [...current, {
        role: "assistant",
        content: `Support chargé : ${String(data.document.name || file.name)}. ${extracted.length} pages contenant du texte sont disponibles pour les questions.`
      }]);
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
    if (question.length > 4000) {
      setError("Ta question est trop longue. Limite : 4 000 caractères.");
      return;
    }
    const next = [...messages, { role: "user" as const, content: question }].slice(-30);
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          mode,
          messages: next.slice(-12),
          sourcePages: sources
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Une erreur est survenue.");
      if (typeof data.answer !== "string" || !data.answer.trim()) {
        throw new Error("Le tuteur a retourné une réponse vide.");
      }
      const answer: string = data.answer;
      setMessages((current) => [...current, { role: "assistant", content: answer }].slice(-30));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de contacter l'assistant.");
    } finally {
      setLoading(false);
    }
  }

  function clearConversation() {
    const initial: Message[] = [{
      role: "assistant",
      content: "Nouvelle séance ouverte. Tu peux reprendre ton apprentissage avec un autre sujet ou un nouveau chapitre."
    }];
    setMessages(initial);
    setError("");
    setInput("");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Rien à faire si le stockage est indisponible.
    }
  }

  const selectedMode = modes.find((item) => item.id === mode) ?? modes[0];

  return <main className="shell">
    <header className="topbar">
      <div className="brand-mark">GP<span>AI</span></div>
      <div className="brand-copy"><strong>GESTION DE PROJET AI</strong><small>TON ESPACE UNIVERSITAIRE INTELLIGENT</small></div>
      <span className="status">Espace étudiant</span>
    </header>

    <section className="hero">
      <p className="eyebrow">APPRENDRE · PRATIQUER · PROGRESSER</p>
      <h1>Comprendre la gestion de projet.<br /><em>Maîtriser la pratique.</em></h1>
      <p className="intro">Un compagnon de formation pour tes cours, tes révisions, tes devoirs et tes travaux pratiques de Licence.</p>
    </section>

    <section className="learning-setup">
      <div className="setup-heading">
        <div><p className="eyebrow">PERSONNALISER MA SÉANCE</p><h2>Par où veux-tu commencer ?</h2></div>
        <button className="reset-button" type="button" onClick={clearConversation}>Nouvelle séance</button>
      </div>
      <div className="level-picker" role="group" aria-label="Niveau de licence">
        {(["L1", "L2", "L3"] as StudyLevel[]).map((item) => (
          <button type="button" key={item} className={level === item ? "level-option active" : "level-option"} onClick={() => setLevel(item)}>
            <strong>{item}</strong><span>{item === "L1" ? "Fondamentaux" : item === "L2" ? "Méthodes et outils" : "Management avancé"}</span>
          </button>
        ))}
      </div>
      <div className="mode-grid">
        {modes.map((item, index) => (
          <button type="button" key={item.id} className={mode === item.id ? "mode-option selected" : "mode-option"} onClick={() => setMode(item.id)}>
            <span className="mode-number">0{index + 1}</span><strong>{item.label}</strong><small>{item.description}</small>
          </button>
        ))}
      </div>
    </section>

    <section className="upload-card">
      <div className="upload-copy">
        <p className="eyebrow">MES SUPPORTS DE COURS</p>
        <h2>Importer un document PDF</h2>
        <p className="upload-description">Le texte est extrait page par page pour permettre au tuteur de retrouver les passages du support et leur pagination.</p>
      </div>
      <label className="upload-button">
        {uploading ? "Lecture du document…" : "＋ Choisir un PDF"}
        <input type="file" accept="application/pdf,.pdf" onChange={importPdf} disabled={uploading} />
      </label>
      {document && <div className="document-status">
        <strong>{document.name}</strong>
        <span>{document.pageCount} pages · {document.extractedPages} pages avec texte · {document.characterCount.toLocaleString("fr-FR")} caractères extraits</span>
        <span className={document.ocrRequired ? "warning-text" : "success-text"}>{document.ocrRequired ? "Extraction partielle — OCR à prévoir" : "Extraction du texte réussie"}</span>
        <button type="button" className="remove-document" onClick={() => { setSources([]); setDocument(null); setNotice("Le support a été retiré de la séance."); }}>Retirer ce support</button>
      </div>}
      {notice && <p className="notice upload-notice">{notice}</p>}
      <p className="storage-note">Confidentialité : le fichier est traité pour la séance et n&apos;est pas conservé dans une bibliothèque permanente. Les PDF scannés ne sont pas encore traités par OCR.</p>
    </section>

    <section className="chat-card">
      <div className="chat-heading">
        <div><span className="online-dot" /> Tuteur pédagogique IA <span className="chat-context">{level} · {selectedMode.label}</span></div>
        <small>{sources.length ? `${sources.length} pages sources chargées` : "Mode général — sans support importé"}</small>
      </div>
      <div className="messages" aria-live="polite" aria-busy={loading}>
        {messages.map((message, index) => <article className={message.role === "user" ? "message user" : "message assistant"} key={index}>
          <span className="speaker">{message.role === "user" ? "TOI" : "TUTEUR PÉDAGOGIQUE"}</span>
          <p>{message.content}</p>
        </article>)}
        {loading && <article className="message assistant"><span className="speaker">TUTEUR PÉDAGOGIQUE</span><p className="typing">Je prépare une réponse adaptée à ton niveau…</p></article>}
        <div ref={messagesEndRef} />
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="quick-questions">
        <span>QUESTIONS POUR DÉMARRER</span>
        {starterQuestions.map((item) => <button key={item} type="button" onClick={() => sendMessage(undefined, item)} disabled={loading}>{item}</button>)}
      </div>
      <div className="mode-hint"><strong>{selectedMode.label} :</strong> {selectedMode.description}. Le tuteur adapte sa réponse à ton niveau {level}.</div>
      <form className="composer" onSubmit={sendMessage}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Écris ta question ou décris ton exercice…" aria-label="Ta question" maxLength={4000} />
        <button type="submit" disabled={loading || !input.trim()}>{loading ? "…" : "Envoyer"}</button>
      </form>
      <p className="notice chat-notice">Les réponses issues d&apos;un support doivent citer le document et les pages réellement exploitées. Les devoirs et corrigés générés restent des propositions pédagogiques à vérifier.</p>
    </section>

    <footer>GESTION DE PROJET AI <span>·</span> APPRENDRE, PRATIQUER, PROGRESSER</footer>
  </main>;
}
