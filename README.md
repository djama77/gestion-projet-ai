# LICENCE GESTION DE PROJET AI

Plateforme universitaire en ligne de formation en gestion de projet, organisée sur les niveaux Licence 1 à Licence 3.

## Périmètre pédagogique recensé

Le dépôt référence un premier périmètre de deux cours issus des documents de travail transmis :

1. **Management et Leadership** — 9 chapitres.
2. **Gestion des compétences** — 7 chapitres.

Le dépôt contient le plan pédagogique et un catalogue détaillé pour les deux cours. Le document Word développé transmis le 27 novembre 2026 (93 pages) a été identifié sous le nom `DOC-20261127-WA0004.docx`. Les deux guides structurés des cours ont été ajoutés dans `docs/cours/` à partir de son contenu. En revanche, le fichier DOCX original et l'intégralité de ses annexes/exercices ne sont pas encore versionnés dans le dépôt ; les guides ne doivent donc pas être présentés comme une transcription intégrale ni comme une assimilation complète par l'application. Les contenus visés comprennent :
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
- `docs/cours/management-leadership-competences/README.md` : catalogue des 16 chapitres, compétences visées, règles de provenance et statut réel de la source DOCX.
- `docs/cours/management-leadership/COURS_MANAGEMENT_LEADERSHIP_STRUCTURE.md` : guide structuré des 9 chapitres de Management et Leadership, rédigé à partir du support Word source.
- `docs/cours/gestion-competences/COURS_GESTION_COMPETENCES_STRUCTURE.md` : guide structuré des 7 chapitres de Gestion des compétences, rédigé à partir du support Word source.
- `docs/evaluations/`
- `docs/architecture/`

Les corrigés indicatifs ne remplacent pas les corrections officielles de l'établissement.

## Atelier mémoire Licence\n\n- Route applicative : `/memoire` — cadrage du sujet, génération du plan, rédaction par chapitre et relecture IA.\n- Spécification : `docs/specifications/generateur-memoire-licence.md`.\n- Le module suit la structure du mini-mémoire modèle transmis (préliminaires, diagnostic, planification, mise en œuvre, suivi-évaluation, retombées, recommandations, conclusion et annexes), sans copier ses données ni son contenu.\n- Les informations manquantes sont signalées ; aucune enquête, statistique réelle, source ou référence n'est inventée. Les brouillons doivent être validés par l'encadreur.\n- Requiert `OPENAI_API_KEY`. Les chapitres ne sont pas encore sauvegardés automatiquement et l'export DOCX reste à développer.\n\n## Modules pédagogiques spécifiés

- `docs/specifications/assistant-devoirs-corriges.md` : analyse des sujets, corrigés pédagogiques détaillés et propositions de rédaction universitaire.
- `docs/specifications/generateur-tp.md` : préparation des TP, guide de réalisation, brouillon modifiable et correction séparée.
- `docs/specifications/generateur-tp-pedagogique-complet.md` : format attendu des TP complets, données simulées et corrigés question par question.
- `docs/specifications/regles-assistant-cours-et-generateur-tp.md` : règles de réponse sourcée, génération de jeux de données simulés et corrigés détaillés question par question.
- `docs/architecture/assimilation-continue-des-cours.md` : import, extraction, classement prudent, versionnage, indexation et recherche.
- `docs/architecture/bibliotheque-documentaire-persistante.md` : stockage privé, versions, sécurité, API, recherche et tests d'acceptation.
- `docs/architecture/connecteur-mcp-corpus-pedagogique.md` : architecture proposée d'un connecteur MCP en lecture seule.
- `docs/ingestion/REGLES_ASSIMILATION_CONTINUE.md` : règles de réception, contrôle, classement et publication des nouveaux supports.
- `docs/specifications/plateforme-gestion-projet-modules.md` : périmètre fonctionnel cible de la plateforme.
- `docs/roadmap/devoirs-tp-et-bibliotheque.md` et `docs/roadmap/plan-execution-et-acceptation.md` : feuilles de route et critères de validation.

Ces documents constituent des spécifications et une feuille de route. Les fonctions de stockage documentaire persistant, de recherche dans les cours, de génération de TP, d'export DOCX/PDF et de serveur MCP ne sont pas toutes opérationnelles.

## Prototype d'import PDF et Word (v0.3)

L'interface accepte désormais les PDF et les documents Word `.docx`. Le PDF est extrait page par page ; le DOCX est lu avec Mammoth puis découpé en segments de texte. Les limites actuelles sont de 12 Mo par fichier, 80 pages pour le PDF, 140 000 caractères pour le DOCX et 80 segments transmis au tuteur. L'import DOCX conserve le texte, mais pas la mise en page, les images ou la structure exacte des tableaux complexes.

Le tuteur dispose maintenant de consignes renforcées pour les TP : énoncé complet, contexte, données simulées, dictionnaire des variables, questions, barème et corrigé intégral question par question. Des scénarios sont prévus pour la gestion des risques et la gestion des compétences. Voir `docs/specifications/generateur-tp-pedagogique-complet.md`.

Pour utiliser les cours reçus : importer le DOCX dans l'interface, puis demander explicitement le chapitre ou le thème souhaité. Les extraits sont transmis à l'IA uniquement pour la session courante.

### Limites connues

- Les fichiers et extraits ne sont pas encore enregistrés dans une bibliothèque persistante.
- Les PDF constitués d'images nécessitent encore un OCR.
- L'import DOCX n'est pas encore persistant et ne reconstitue pas les tableaux complexes ou les images.
- La recherche durable, les comptes utilisateurs, les exports DOCX/PDF et le suivi de progression restent à développer.
- Le contexte transmis au tuteur est limité ; le prototype ne garantit pas la récupération de tous les passages d'un cours volumineux.

## Statut de la bibliothèque documentaire et du connecteur MCP

Les spécifications décrivent une bibliothèque privée, versionnée et un connecteur MCP en lecture seule. Elles ne signifient pas que le stockage, l'indexation, l'authentification, le serveur MCP ou un fournisseur cloud sont déjà configurés. Le choix du fournisseur et les éventuels coûts doivent être validés avant leur activation. La compatibilité MCP doit être vérifiée client par client.

## Gouvernance du corpus

Un document n'est considéré comme assimilé qu'après conservation de l'original, extraction contrôlée, validation des métadonnées et indexation vérifiée. Les réponses doivent citer les pages ou sections réellement retrouvées et signaler toute information absente des supports importés.
