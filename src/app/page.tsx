"use client";

import { FormEvent, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Explique-moi une notion simplement",
  "Aide-moi à réviser un chapitre",
  "Propose-moi un exercice corrigé"
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Bonjour ! Je suis votre assistant pédagogique. Posez une question sur vos cours, demandez une explication ou un exercice. Lorsque les documents de cours seront intégrés, je pourrai fonder mes réponses sur leurs contenus."
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        body: JSON.stringify({ messages: next.slice(-12) })
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
      <span className="status">Prototype</span>
    </header>
    <section className="hero">
      <p className="eyebrow">ESPACE D’APPRENTISSAGE UNIVERSITAIRE</p>
      <h1>Apprendre, comprendre<br /><em>et progresser.</em></h1>
      <p className="intro">Un accompagnement pédagogique pour les trois années de Licence, avec des explications, des exercices et des révisions.</p>
    </section>
    <section className="chat-card">
      <div className="chat-heading"><div><span className="online-dot" /> Assistant IA</div><small>Licence 1 · Licence 2 · Licence 3</small></div>
      <div className="messages" aria-live="polite">
        {messages.map((message, index) => <article className={message.role === "user" ? "message user" : "message assistant"} key={index}>
          <span className="speaker">{message.role === "user" ? "VOUS" : "TUTEUR PÉDAGOGIQUE"}</span>
          <p>{message.content}</p>
        </article>)}
        {loading && <article className="message assistant"><span className="speaker">TUTEUR PÉDAGOGIQUE</span><p className="typing">Préparation de la réponse…</p></article>}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="suggestions">{suggestions.map(item => <button key={item} onClick={() => sendMessage(undefined, item)} disabled={loading}>{item}</button>)}</div>
      <form className="composer" onSubmit={sendMessage}>
        <input value={input} onChange={event => setInput(event.target.value)} placeholder="Écrivez votre question…" aria-label="Votre question" />
        <button type="submit" disabled={loading || !input.trim()}>{loading ? "…" : "Envoyer"}</button>
      </form>
      <p className="notice">Les réponses de cette première version ne sont pas encore reliées à votre bibliothèque de cours. Vérifiez les informations importantes avec vos supports pédagogiques.</p>
    </section>
    <footer>LICENCE GESTION DE PROJET AI <span>·</span> VERSION INITIALE 0.1</footer>
  </main>;
}