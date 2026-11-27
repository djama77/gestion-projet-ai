# Feuille de route — Devoirs, TP et assimilation documentaire

Cette feuille de route décrit les étapes proposées. Elle ne signifie pas que les fonctionnalités sont déjà opérationnelles.

## Phase 1 — Socle documentaire

- [ ] Définir les modèles Document, DocumentVersion, Course, Chapter, SourcePassage.
- [ ] Mettre en place stockage privé et métadonnées.
- [ ] Développer l'import PDF/DOCX/TXT.
- [ ] Ajouter extraction, pagination et détection de doublons.
- [ ] Ajouter OCR pour les PDF numérisés.
- [ ] Construire la bibliothèque avec statuts et erreurs.
- [ ] Ajouter recherche plein texte avec références.

## Phase 2 — Tuteur fondé sur les cours

- [ ] Connecter la route de chat à la recherche documentaire.
- [ ] Injecter seulement les extraits pertinents avec leurs références.
- [ ] Afficher les sources dans les réponses.
- [ ] Signaler les réponses non documentées.
- [ ] Séparer les explications du cours et les compléments externes.
- [ ] Ajouter des tests anti-hallucination et tests de citation.

## Phase 3 — Devoirs corrigés

- [ ] Importer un sujet et préserver les consignes.
- [ ] Décomposer les questions et livrables.
- [ ] Retrouver les chapitres utiles.
- [ ] Générer une correction pédagogique détaillée.
- [ ] Générer une proposition de rédaction universitaire distincte.
- [ ] Ajouter relecture, autoévaluation et export DOCX/PDF.

## Phase 4 — Travaux pratiques

- [ ] Détecter le type de TP et les livrables demandés.
- [ ] Générer un guide de réalisation.
- [ ] Générer un brouillon modifiable.
- [ ] Produire une correction indicative séparée.
- [ ] Vérifier les calculs et données.
- [ ] Exporter les dossiers en DOCX/PDF.

## Phase 5 — Assimilation continue et suivi

- [ ] Traiter chaque nouveau document selon le même pipeline.
- [ ] Versionner et réindexer sans écraser les originaux.
- [ ] Relier les évaluations aux notions et chapitres.
- [ ] Mesurer les acquis à partir des résultats observés.
- [ ] Proposer des révisions ciblées sans inventer le programme.

## Priorités de réalisation

P0 : stockage privé, import fiable, extraction, provenance et recherche documentaire.

P1 : tuteur avec citations, devoirs corrigés et export.

P2 : générateur de TP, tableaux de bord et suivi des compétences.

## Validation avant mise en production

- Tests sur PDF textuel, PDF scanné, DOCX, tableaux et documents mal formés.
- Vérification des pages et extraits cités.
- Tests de sécurité des imports et des accès.
- Tests de non-régression de la conversation existante.
- Vérification du coût et des limites des appels IA.
- Déploiement seulement après configuration sécurisée des variables d'environnement.