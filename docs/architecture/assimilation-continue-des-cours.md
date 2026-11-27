# Assimilation continue des cours et documents

## Finalité

Tout nouveau cours ajouté à la bibliothèque doit pouvoir être analysé, classé, indexé et mobilisé par le tuteur, les outils de devoirs et le générateur de TP. L'import d'un fichier ne signifie pas que son contenu a été correctement assimilé : chaque étape doit être contrôlée et son statut visible.

## Formats visés

PDF textuel, PDF numérisé avec OCR, DOCX, PPTX et TXT. Les formats non pris en charge doivent produire un message explicite.

## Pipeline d'import

1. Réception sécurisée et validation du type, de la taille et du fichier.
2. Calcul d'une empreinte pour détecter les doublons.
3. Conservation du fichier original sans modification.
4. Extraction du texte, des titres, tableaux, listes, images et pages.
5. OCR pour les pages numérisées, avec indicateur de confiance lorsque disponible.
6. Détection des métadonnées : titre, matière, niveau, enseignant, année, chapitre et pagination.
7. Classement seulement lorsque les éléments sont étayés par le document ou confirmés par l'utilisateur.
8. Découpage en passages conservant document, version, page et section.
9. Indexation plein texte et, ultérieurement, recherche sémantique.
10. Contrôle qualité et publication dans la bibliothèque.

## Règles de classement

- Les niveaux Licence 1, Licence 2 et Licence 3 ne sont attribués que sur preuve documentaire ou validation explicite.
- Si le niveau ou la matière est incertain, utiliser « à confirmer ».
- Ne pas créer de programme officiel à partir de suggestions de l'IA.
- Les propositions de modules générées par l'IA sont identifiées comme propositions et nécessitent validation.
- Un nouveau document ne doit jamais écraser silencieusement une version précédente.

## Statuts visibles

En attente → Téléversé → Extraction en cours → À vérifier → Indexation → Disponible → Échec (avec motif) → À retraiter.

L'utilisateur doit pouvoir consulter les erreurs et relancer le traitement sans perdre le document original.

## Versions et relations documentaires

- Conserver les versions successives et leur date d'import.
- Relier un sujet, un corrigé, un cours et ses annexes sans les fusionner.
- Détecter les doublons par empreinte, mais demander confirmation en cas de similarité seulement.
- Garder l'historique des corrections de métadonnées.
- Réindexer une nouvelle version sans supprimer l'ancienne.

## Recherche et génération augmentée par les documents

Les réponses du tuteur doivent rechercher les passages pertinents dans la bibliothèque avant de répondre lorsqu'une question porte sur un cours. Le contexte transmis au modèle doit contenir les extraits et leurs métadonnées de provenance.

La réponse doit :
- citer le document et la page/section lorsqu'ils existent ;
- distinguer source et explication IA ;
- indiquer « information non retrouvée dans les documents importés » si la recherche ne permet pas de soutenir la réponse ;
- éviter d'affirmer que tous les cours sont assimilés si l'indexation a échoué ou reste incomplète.

## Sécurité et confidentialité

- Stockage privé par défaut pour les fichiers de cours et travaux étudiants.
- Contrôle d'accès par utilisateur et rôle.
- Clés API conservées côté serveur dans les variables d'environnement.
- Validation des fichiers et limitation des tailles.
- Journaux techniques sans exposer le contenu sensible des documents.
- Suppression et export des données selon les règles de l'application.

## Architecture technique cible

- Interface Next.js existante.
- API serveur pour l'authentification, les imports et les conversations.
- Stockage objet privé pour les originaux.
- Base relationnelle pour utilisateurs, documents, versions, métadonnées, travaux et progression.
- Service de traitement documentaire/OCR.
- Index de recherche textuelle, puis vectorielle si utile.
- Couche d'orchestration IA qui applique les règles de provenance et de non-invention.

Le choix final des fournisseurs et services doit être validé avant leur activation. Aucun secret ne doit être commité dans Git.

## Critères d'acceptation

- Un nouveau document suit le pipeline sans intervention technique.
- Le statut d'import et les erreurs sont visibles.
- Les documents originaux et leurs versions sont conservés.
- Les réponses documentaires citent des sources traçables.
- Les nouveaux cours deviennent recherchables après indexation réussie.
- Les documents mal extraits ou ambigus sont signalés et non présentés comme assimilés.