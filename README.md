# LICENCE GESTION DE PROJET AI

Plateforme universitaire en ligne de formation en gestion de projet, organisée sur les niveaux Licence 1 à Licence 3.

## Périmètre pédagogique recensé

Le dépôt référence deux cours :
1. **Management et Leadership** — 9 chapitres.
2. **Gestion des compétences** — 7 chapitres.

### Supports et cours développés

- Support source importé (transcription de 22 pages) : `docs/cours/source-integrale-cours-gestion-projet-licence.md`.
- Cours développé Management et Leadership : `docs/cours/management-leadership/COURS_DEVELOPPE_9_CHAPITRES.md`.
- Cours développé Gestion des compétences : `docs/cours/gestion-competences/COURS_DEVELOPPE_7_CHAPITRES.md`.

Les deux documents développés comportent des explications structurées, des exemples liés à la gestion de projet, des exercices avec corrections proposées et des points de révision. Ils complètent le support source sans le remplacer. Les exercices ajoutés sont pédagogiques et leurs corrections sont indicatives, non officielles.

**Fidélité documentaire :** le document source demeure une transcription textuelle à vérifier contre le DOCX original. Les niveaux M1 et Licence 3 coexistent dans les mentions du cours Management et Leadership ; ils sont conservés sans harmonisation.

## Règles de qualité pédagogique

- Distinguer le contenu issu des supports de cours des compléments pédagogiques.
- Ne jamais inventer une référence de page ou attribuer un corrigé à l'enseignant sans preuve.
- Distinguer corrigé officiel, corrigé attendu du document source et proposition de correction par l'IA.
- Expliquer les raisonnements et méthodes, pas seulement donner les réponses.
- Relier chaque chapitre aux compétences visées et aux évaluations.
- Fournir une rétroaction formative et des exercices de remédiation.

## Architecture cible

Plateforme cloud-first, accessible sur Internet et adaptée aux ordinateurs, tablettes et téléphones Android. Le mode hybride désigne la pédagogie (apprentissage autonome et parcours guidé), et non un fonctionnement local/hors ligne.

## Parcours pédagogique

1. Cours et définitions.
2. Exemples et applications.
3. Exercices progressifs et corrigés expliqués.
4. QCM et études de cas.
5. Évaluation des compétences.
6. Détection des lacunes et remédiation.
7. Révision espacée et suivi des progrès.

## Structure des contenus

- `docs/cours/management-leadership/`
- `docs/cours/gestion-competences/`
- `docs/evaluations/`
- `docs/architecture/`

Les corrigés indicatifs ne remplacent pas les corrections officielles de l'établissement.

## Modules pédagogiques spécifiés

- `docs/specifications/assistant-devoirs-corriges.md` : analyse des sujets, corrigés pédagogiques détaillés et propositions de rédaction universitaire.
- `docs/specifications/generateur-tp.md` : préparation des TP, guide de réalisation, brouillon modifiable et correction séparée.
- `docs/architecture/assimilation-continue-des-cours.md` : import, extraction, classement prudent, versionnage, indexation et recherche.
- `docs/architecture/bibliotheque-documentaire-persistante.md` : stockage privé, versions, sécurité, API, recherche et tests d'acceptation.
- `docs/architecture/connecteur-mcp-corpus-pedagogique.md` : architecture proposée d'un connecteur MCP en lecture seule.
- `docs/ingestion/REGLES_ASSIMILATION_CONTINUE.md` : règles de réception, contrôle, classement et publication des nouveaux supports.
- `docs/specifications/plateforme-gestion-projet-modules.md` : périmètre fonctionnel cible de la plateforme.
- `docs/roadmap/devoirs-tp-et-bibliotheque.md` et `docs/roadmap/plan-execution-et-acceptation.md` : feuilles de route et critères de validation.

Ces documents constituent des spécifications et une feuille de route. Les fonctions de stockage documentaire persistant, de recherche dans les cours, de génération de TP, d'export DOCX/PDF et de serveur MCP ne sont pas toutes opérationnelles.

## Prototype d'import PDF (v0.2)

Une première étape permet de sélectionner un PDF, d'extraire le texte page par page côté serveur et de transmettre des extraits au tuteur pour la session courante. Les limites actuelles sont de 12 Mo, 80 pages et 100 000 caractères extraits.

### Limites connues

- Les fichiers et extraits ne sont pas encore enregistrés dans une bibliothèque persistante.
- Les PDF constitués d'images nécessitent encore un OCR.
- La recherche durable, les comptes utilisateurs, les exports DOCX/PDF et le suivi de progression restent à développer.
- Le contexte transmis au tuteur est limité ; le prototype ne garantit pas la récupération de tous les passages d'un cours volumineux.

## Outils pratiques utilisés comme supports d'apprentissage

Une interface expérimentale est disponible sur la route `/atelier`. Elle sert uniquement de support pédagogique pour pratiquer les méthodes vues en cours, et non de module principal de pilotage de projets professionnels :
- WBS : découpage des activités, responsables, dates et avancement ;
- Gantt : représentation visuelle des périodes saisies ;
- RACI : attribution R/A/C/I par activité ;
- Budget : prévision, dépenses enregistrées et écarts ;
- Risques : probabilité, impact, score, réponse et statut ;
- tableau de bord calculé à partir des données saisies.

**Limite importante :** dans ce premier lot, les données de l'atelier sont sauvegardées dans le navigateur courant. L'export/import JSON permet une sauvegarde manuelle. La synchronisation cloud multi-appareils n'est pas encore opérationnelle. Le Gantt ne calcule pas encore les dépendances ni le chemin critique.

Le schéma de référence proposé pour la bibliothèque privée et la persistance des projets est dans `supabase/schema.sql`. Il n'a pas été appliqué à un projet Supabase. Voir `docs/architecture/MISE_EN_SERVICE_PERSISTANCE_CLOUD.md` avant toute activation.

## Bibliothèque documentaire

Une interface de catalogue est accessible sur `/bibliotheque`, avec une route `GET /api/library` et une recherche littérale dans les passages présents dans l'index versionné. Le catalogue et l'index sont dans `docs/catalogues/`. Le catalogue référence désormais le support source et les deux cours développés. Cela ne garantit pas à lui seul que le tuteur de l'application utilise déjà les nouveaux fichiers dans ses réponses : l'intégration de la recherche et du contexte applicatif doit être testée séparément.

## Statut de la bibliothèque documentaire et du connecteur MCP

Les spécifications décrivent une bibliothèque privée, versionnée et un connecteur MCP en lecture seule. Elles ne signifient pas que le stockage, l'indexation, l'authentification, le serveur MCP ou un fournisseur cloud sont déjà configurés. Le choix du fournisseur et les éventuels coûts doivent être validés avant leur activation. La compatibilité MCP doit être vérifiée client par client.

## Gouvernance du corpus

Un document n'est considéré comme assimilé qu'après conservation de l'original, extraction contrôlée, validation des métadonnées et indexation vérifiée. Les réponses doivent citer les pages ou sections réellement retrouvées et signaler toute information absente des supports importés.


## TP Licence 3 — Management, leadership et gestion des compétences

La série de 10 TP et les corrigés détaillés question par question sont conservés dans le dépôt :
- `docs/evaluations/TP_L3_management_leadership_competences.md` : sujets et consignes.
- `docs/evaluations/CORRIGES_10_TP_L3_question_par_question.md` : corrigés pédagogiques détaillés.
- `docs/datasets/generation-jeux-donnees-TP-L3.md` : règles de génération, variables, contrôles et usages pédagogiques.
- `scripts/generate-tp-datasets.mjs` : générateur déterministe de jeux de données CSV et JSON pour les dix TP.

Les données générées sont fictives, identifiées comme simulées et destinées à l'entraînement. Les corrections restent indicatives et ne sont pas présentées comme officielles.


## Espace interactif des TP Licence 3

Une page dédiée est disponible à la route `/tp-l3` :
- sélection des dix TP de Management, Leadership et Gestion des compétences ;
- présentation des objectifs, compétences et questions de travail ;
- génération côté navigateur de jeux de données pédagogiques simulées ;
- export CSV et JSON, avec graine reproductible ;
- demande de guide de réalisation ou de corrigé détaillé au tuteur IA ;
- l'API `/api/tp-l3` lit les sujets et corrigés versionnés dans `docs/evaluations/` pour contextualiser ses réponses.

Le lien « TP Licence 3 » est accessible depuis la page d'accueil. Les fonctions d'assistance nécessitent une clé API OpenAI configurée côté serveur. Les jeux de données générés sont des exemples synthétiques, non des observations réelles. Le niveau de difficulté est une consigne transmise au tuteur ; il ne modifie pas encore automatiquement la distribution statistique des données.
