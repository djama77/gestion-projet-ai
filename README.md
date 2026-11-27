# LICENCE GESTION DE PROJET AI

Plateforme universitaire en ligne de formation en gestion de projet, organisée sur les niveaux Licence 1 à Licence 3.

## Périmètre pédagogique recensé

Le dépôt référence un premier périmètre de deux cours issus des documents de travail transmis :

1. **Management et Leadership** — 9 chapitres.
2. **Gestion des compétences** — 7 chapitres.

Le plan pédagogique disponible recense les contenus attendus. Les supports originaux complets (PDF/DOCX) doivent encore être inventoriés et ajoutés avant de considérer ces chapitres comme intégralement présents et assimilés. Le document Word développé doit être vérifié dans le dépôt avant d'être considéré comme une ressource versionnée. Les contenus visés comprennent :
- définitions et notions essentielles ;
- développement structuré du cours ;
- applications à des situations de gestion de projet ;
- exercices avec corrigés indicatifs ;
- points essentiels à retenir.

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

## Statut de la bibliothèque documentaire et du connecteur MCP

Les spécifications décrivent une bibliothèque privée, versionnée et un connecteur MCP en lecture seule. Elles ne signifient pas que le stockage, l'indexation, l'authentification, le serveur MCP ou un fournisseur cloud sont déjà configurés. Le choix du fournisseur et les éventuels coûts doivent être validés avant leur activation. La compatibilité MCP doit être vérifiée client par client.

## Gouvernance du corpus

Un document n'est considéré comme assimilé qu'après conservation de l'original, extraction contrôlée, validation des métadonnées et indexation vérifiée. Les réponses doivent citer les pages ou sections réellement retrouvées et signaler toute information absente des supports importés.
