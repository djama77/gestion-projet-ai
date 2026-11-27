# Bibliothèque documentaire — état d'implémentation

## Ce qui est présent dans le dépôt

- Un catalogue versionné dans `docs/catalogues/corpus.json`.
- Un index de recherche dans `docs/catalogues/index.json`.
- Une route serveur `GET /api/library` et une interface `/bibliotheque` déjà présentes dans le dépôt.
- Une transcription textuelle du support source de 22 pages : `docs/cours/source-integrale-cours-gestion-projet-licence.md`.
- Un cours développé en 9 chapitres : `docs/cours/management-leadership/COURS_DEVELOPPE_9_CHAPITRES.md`.
- Un cours développé en 7 chapitres : `docs/cours/gestion-competences/COURS_DEVELOPPE_7_CHAPITRES.md`.

## Contenu pédagogique ajouté

Les 16 chapitres développés comportent des explications structurées, des exemples liés à la gestion de projet, des exercices avec corrections proposées et des points de révision. Ils complètent le support source sans le remplacer.

L'index comprend 59 passages au total : les 43 passages initialement importés du support source et 16 passages correspondant aux chapitres développés. Les passages développés sont identifiés par le statut `COMPLEMENT_PEDAGOGIQUE_A_RELIRE` et n'ont pas de pagination du document original.

## Réserves documentaires

- Le support source de 22 pages a été transcrit ; sa fidélité doit encore être relue contre le DOCX original.
- Le DOCX binaire original n'est pas archivé dans ce dépôt.
- Le premier cours porte la mention M1 dans son en-tête et Licence 3 dans ses évaluations : les deux indications sont conservées.
- Les exercices nouvellement créés et leurs corrections sont des compléments pédagogiques indicatifs, non des corrigés officiels.
- Les évaluations, QCM, sujets et corrigés attendus du support source restent dans la transcription d'origine.

## Limites techniques actuelles

- Le catalogue et l'index sont versionnés dans Git ; ce n'est pas encore un stockage privé multi-utilisateur ni un téléversement permanent depuis l'interface.
- La recherche actuelle est une recherche littérale simple sur les passages indexés, sans classement sémantique.
- L'interface ne permet pas nécessairement d'éditer les cours ou de les téléverser depuis l'application.
- Le stockage objet, l'authentification, les contrôles d'accès, l'extraction persistante, l'OCR et les tâches de traitement restent à réaliser.
- Aucune connexion Supabase n'est activée.

## Vérifications à effectuer avant de déclarer l'assimilation complète

1. Relire la transcription source contre le DOCX original.
2. Contrôler le rendu de la page `/bibliotheque` et la récupération des 59 passages par `GET /api/library`.
3. Tester des recherches ciblées dans les 16 chapitres développés.
4. Vérifier que le tuteur applicatif transmet bien les résultats de recherche au modèle lorsqu'il répond aux questions de cours.
5. Tester l'absence de confusion entre contenu source, compléments pédagogiques et corrigés officiels.
