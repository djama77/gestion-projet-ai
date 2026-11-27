# LICENCE GESTION DE PROJET AI

Plateforme universitaire en ligne de formation en gestion de projet, organisée sur les niveaux Licence 1 à Licence 3.

## Supports pédagogiques intégrés

Le premier lot de contenus couvre deux cours issus du document transmis :

1. **Management et Leadership** — 9 chapitres.
2. **Gestion des compétences** — 7 chapitres.

Le document Word développé accompagne ce dépôt. Il comprend pour chaque chapitre :
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


## Nouveaux modules spécifiés

Les spécifications fonctionnelles et techniques des évolutions sont disponibles dans :

- `docs/specifications/assistant-devoirs-corriges.md` : analyse des sujets, corrigés pédagogiques détaillés et propositions de rédaction universitaire humanisée.
- `docs/specifications/generateur-tp.md` : préparation des TP, guide de réalisation, brouillon modifiable et correction séparée.
- `docs/architecture/assimilation-continue-des-cours.md` : import, extraction, classement prudent, versionnage, indexation et recherche des nouveaux cours.
- `docs/roadmap/devoirs-tp-et-bibliotheque.md` : phases de réalisation et critères de validation.

Ces documents constituent des spécifications et une feuille de route. Les modules d'import documentaire, de recherche dans les cours, de génération de TP et d'export DOCX/PDF ne sont pas encore déclarés opérationnels. Les réponses devront distinguer les sources du cours, les explications de l'IA et les compléments externes.


## Prototype d'import PDF (v0.2)

Une première étape technique est ajoutée sur la branche de développement :

- sélection d'un PDF depuis l'interface ;
- extraction du texte page par page côté serveur ;
- limites de sécurité : 12 Mo, 80 pages et 100 000 caractères extraits ;
- transmission des extraits de pages au tuteur pour la session en cours ;
- affichage du nom du fichier, du nombre de pages et de l'état d'extraction ;
- citations attendues sous la forme du nom du document et de la page PDF.

### Limites connues de cette étape

- Les fichiers et extraits ne sont pas encore enregistrés dans une bibliothèque persistante : ils restent disponibles uniquement dans l'état de la session navigateur.
- Les PDF constitués d'images nécessitent encore un OCR ; les pages sans texte sont signalées et ne sont pas interprétées.
- La recherche sémantique, l'indexation durable, les comptes utilisateurs, les exports DOCX/PDF des devoirs et TP et le suivi de progression restent à développer.
- Le texte transmis au tuteur est limité afin de maîtriser la taille du contexte ; ce prototype ne garantit pas encore la récupération de tous les passages d'un cours volumineux.

Cette étape ne doit pas être présentée comme une assimilation permanente de tous les cours. La prochaine priorité est le stockage privé versionné et l'indexation documentaire durable.
