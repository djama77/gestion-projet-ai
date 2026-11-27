"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./bibliotheque.css";

type Course = {
  course_id: string;
  title: string;
  expected_chapter_count: number;
  level: string;
  inventory_status: string;
  source_documents: string[];
};
type SearchResult = {
  document_id: string;
  title: string;
  course: string;
  chapter?: string;
  page?: number;
  section?: string;
  content: string;
  source_path: string;
  validation_status: string;
};
type LibraryResponse = {
  catalog: { courses: Course[]; documents: unknown[]; notice: string };
  search: { indexedPassages: number; results: SearchResult[]; status: string; message: string };
};

export default function BibliothequePage() {
  const [data, setData] = useState<LibraryResponse | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/library")
      .then((response) => {
        if (!response.ok) throw new Error("La bibliothèque est momentanément indisponible.");
        return response.json() as Promise<LibraryResponse>;
      })
      .then((result) => { if (active) setData(result); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Erreur de chargement."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!data || query.trim().length < 2) return;
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      fetch("/api/library?q=" + encodeURIComponent(query.trim()), { signal: controller.signal })
        .then((response) => response.json() as Promise<LibraryResponse>)
        .then((result) => { if (active) setData(result); })
        .catch(() => undefined);
    }, 250);
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [query]);

  const courses = data?.catalog.courses || [];
  const results = data?.search.results || [];

  return <main className="library-shell">
    <header className="library-header">
      <Link href="/" className="library-back">← Retour au tuteur</Link>
      <span>GESTION-PROJET-AI <b>BIBLIOTHÈQUE</b></span>
      <Link href="/atelier" className="library-workshop">Ouvrir l’atelier</Link>
    </header>
    <section className="library-hero">
      <p className="library-eyebrow">CORPUS DOCUMENTAIRE ÉVOLUTIF</p>
      <h1>Bibliothèque documentaire permanente</h1>
      <p>Un espace organisé pour retrouver les cours, chapitres, exercices, travaux pratiques et corrigés, avec une traçabilité de leurs sources.</p>
      <label className="library-search">
        <span>Rechercher dans les passages indexés</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex. gouvernance, leadership, compétences…" />
      </label>
    </section>
    {loading && <p className="library-state">Chargement du catalogue…</p>}
    {error && <p className="library-error">{error}</p>}
    {data && <>
      <section className="library-status">
        <article><span>Supports répertoriés</span><strong>{data.catalog.documents.length}</strong></article>
        <article><span>Passages indexés</span><strong>{data.search.indexedPassages}</strong></article>
        <article><span>Collections pédagogiques</span><strong>{courses.length}</strong></article>
      </section>
      <p className="library-notice">{data.catalog.notice}</p>
      {query.trim().length >= 2 ? <section className="library-section">
        <h2>Résultats de recherche</h2>
        <p className="library-muted">{data.search.message}</p>
        {results.map((item, index) => <article className="library-result" key={item.document_id + "-" + index}>
          <h3>{item.title}</h3>
          <p>{item.course}{item.chapter ? " · " + item.chapter : ""}{item.page ? " · page " + item.page : ""}</p>
          <blockquote>{item.content}</blockquote>
          <small>{item.source_path} · {item.validation_status}</small>
        </article>)}
      </section> : <section className="library-section">
        <h2>Collections recensées</h2>
        <p className="library-muted">Le nombre de chapitres indiqué correspond au périmètre pédagogique recensé, pas au nombre de fichiers déjà importés.</p>
        <div className="library-courses">{courses.map((course) => <article className="library-course" key={course.course_id}>
          <span className="library-course-tag">INVENTAIRE INITIAL</span>
          <h3>{course.title}</h3>
          <p>{course.expected_chapter_count} chapitres attendus · Niveau à confirmer</p>
          <small>Aucun support original n’est encore référencé dans cette collection.</small>
        </article>)}</div>
      </section>}
    </>}
    <footer className="library-footer">Un document ne sera déclaré assimilé qu’après conservation de sa source, extraction contrôlée, validation des métadonnées et indexation vérifiable.</footer>
  </main>;
}
