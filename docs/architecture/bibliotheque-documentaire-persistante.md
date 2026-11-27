# Bibliothèque documentaire persistante — spécification technique v1

## 1. Objectif
Faire évoluer l'import PDF de session vers une bibliothèque privée, durable et consultable depuis plusieurs sessions. Un document ne sera considéré comme assimilé que lorsque son original est conservé, que son extraction est contrôlée, que ses métadonnées sont validées et que ses passages sont retrouvables dans la recherche.
Cette spécification prépare l'implémentation. Elle ne présume pas du fournisseur de stockage ou de base de données et n'active aucun service externe.

## 2. Principes non négociables
- Originaux conservés sans modification, jamais remplacés silencieusement.
- Documents privés par défaut, accès selon utilisateur et espace explicitement autorisé.
- L1/L2/L3, matières et chapitres attribués uniquement sur preuve documentaire ou validation humaine ; sinon « à confirmer ».
- Les propositions de classement IA restent des suggestions jusqu'à validation.
- Toute réponse issue d'un cours cite le document et la page ou section réellement disponibles.
- Un échec d'extraction ou d'indexation n'est jamais présenté comme une assimilation réussie.
- Secrets uniquement côté serveur, jamais dans Git.

## 3. Modèle de données logique
### documents
- id UUID ; owner_id ; title ; subject_label ; level_label ; course_label.
- classification_status : suggested, confirmed, needs_review.
- current_version_id ; visibility (private par défaut) ; created_at ; updated_at.

### document_versions
- id ; document_id ; version_number ; original_filename ; mime_type ; file_size.
- sha256 pour les doublons exacts ; storage_key opaque vers l'objet privé.
- page_count ; extracted_character_count.
- extraction_status : pending, processing, completed, partial, failed.
- index_status : pending, processing, completed, failed.
- ocr_status : not_needed, required, processing, completed, failed.
- failure_code ; failure_message expurgé ; imported_at ; processed_at.

### document_passages
- id ; document_id ; version_id ; page_number nullable ; section_heading nullable.
- passage_index ; content ; content_hash ; token_count.
- search_text ; embedding uniquement dans une phase ultérieure.
- Unicité logique sur version_id + passage_index.

### document_metadata_history
- id ; document_id ; version_id ; field_name ; old_value ; new_value.
- change_source : user, ai_suggestion, admin ; changed_at ; changed_by.
Les identifiants utilisateurs, rôles et relations d'accès proviennent du système d'authentification retenu ; ne pas créer un système d'identité parallèle.

## 4. Pipeline d'import
1. Vérifier la session et le droit d'import.
2. Contrôler extension, type MIME réel, taille, signature et limites de traitement.
3. Calculer SHA-256 côté serveur.
4. Signaler les doublons exacts dans le même espace ; ne pas créer une version sans choix explicite.
5. Créer le document ou une nouvelle version.
6. Stocker l'original dans un espace objet privé.
7. Créer une tâche de traitement idempotente.
8. Extraire texte, pages, titres et tableaux lorsque possible.
9. Détecter les pages vides ou probablement numérisées ; signaler OCR ou validation nécessaire.
10. Proposer titre, matière, niveau et chapitres avec éléments justificatifs.
11. Faire valider les métadonnées ambiguës.
12. Découper en passages en conservant page et section.
13. Indexer en recherche plein texte.
14. Marquer la version disponible uniquement si les contrôles requis sont satisfaits.
15. Afficher historique, statut et erreurs.

## 5. Contrat API proposé
Ces routes sont des contrats cibles, pas des fonctionnalités déjà opérationnelles.
- POST /api/documents : créer un import et obtenir une URL d'envoi signée courte durée, ou recevoir le fichier côté serveur selon le fournisseur.
- POST /api/documents/:id/complete-upload : confirmer l'envoi, vérifier l'objet, déclencher le traitement.
- GET /api/documents : lister uniquement les documents autorisés pour l'utilisateur courant.
- GET /api/documents/:id : métadonnées et versions accessibles.
- GET /api/documents/:id/versions/:versionId/status : état détaillé du pipeline.
- POST /api/documents/:id/reprocess : relancer un traitement idempotent.
- PATCH /api/documents/:id/metadata : modifier les métadonnées avec historique.
- GET /api/documents/search?q=... : rechercher les passages autorisés et retourner leurs références.
- DELETE /api/documents/:id : suppression logique puis suppression contrôlée des objets et index.
Toutes les routes appliquent l'autorisation côté serveur. Ne jamais se fier à un owner_id fourni par le navigateur.

## 6. Recherche documentaire et tuteur
La recherche commence par le plein texte, avec filtre obligatoire sur les droits d'accès. La recherche vectorielle est facultative et sera évaluée après constitution d'un corpus réel.
Le tuteur reçoit les passages pertinents et leur provenance : titre, version, page ou section si connue, et passage source.
- Distinguer extrait du cours et explication pédagogique.
- Citer uniquement les références réellement retournées.
- Dire clairement lorsqu'aucun passage pertinent n'a été retrouvé.
- Ne pas présenter une connaissance générale comme un contenu du cours.
- Identifier séparément tout apport externe.

## 7. Sécurité, confidentialité et résilience
- Stockage objet privé ; accès via URL signée à courte durée.
- Contrôle d'accès sur chaque lecture, écriture, téléchargement et recherche.
- Limites de taille, pages, durée et volume extrait.
- Vérification du type réel, neutralisation des noms et protection contre fichiers malformés.
- Secrets uniquement dans les variables d'environnement serveur.
- Journaux sans contenu intégral des cours, jetons, URL signées ou données personnelles.
- Suppression et export des données documentés.
- Tâches rejouables sans doublons ; codes d'erreur stables et messages compréhensibles.
- Sauvegardes et restauration à définir selon le fournisseur.

## 8. États affichés
uploaded → extracting → review_required si métadonnées ambiguës → indexing → available.
États alternatifs : partial, failed, reprocessing, deletion_pending.
L'interface distingue conservation de l'original, état d'extraction, besoin OCR, validation des métadonnées et disponibilité de l'index.

## 9. Stratégie de réalisation
### Lot A — fondations
- Choix/configuration de l'authentification, de la base et du stockage.
- Schéma relationnel, règles d'accès, variables d'environnement documentées.
- Migration réversible et tests d'accès croisés entre utilisateurs.
### Lot B — import durable
- Téléversement privé, SHA-256, doublons, versionnage et statuts.
- Traitement asynchrone ou mécanisme de reprise adapté à l'hébergement.
### Lot C — extraction et indexation
- Rendre persistante l'extraction PDF existante.
- Ajouter DOCX et PPTX après tests de fidélité.
- OCR séparé, après choix du service et contrôle des coûts.
- Indexation plein texte et recherche paginée.
### Lot D — tuteur documentaire
- Remplacer le transfert manuel des pages par une recherche dans la bibliothèque.
- Citations traçables et tests anti-hallucination.
- Tests sur Management et Leadership (9 chapitres) et Gestion des compétences (7 chapitres), sans inventer d'autres cours.

## 10. Tests d'acceptation obligatoires
1. Un utilisateur A ne peut ni lister, lire, télécharger ou rechercher les documents de B.
2. Un PDF accepté est conservé et retrouvé après déconnexion/reconnexion.
3. Un doublon exact est détecté sans écraser une version.
4. Une nouvelle version conserve l'ancienne et son historique.
5. Un PDF scanné est signalé OCR requis ; aucune assimilation complète n'est annoncée.
6. Une extraction partielle reste visible comme partielle.
7. Les pages citées correspondent exactement aux passages retrouvés.
8. Une recherche ne retourne jamais de passage hors périmètre d'accès.
9. Une relance ne crée pas de doublons.
10. Une suppression ne laisse pas de passages indexés accessibles.
11. Les limites de taille et de pages sont appliquées côté serveur.
12. Les erreurs ne divulguent ni secrets ni contenu privé dans les journaux.

## 11. Décisions fournisseur à valider
Comparer stockage objet privé, coût de sortie, PostgreSQL managé, authentification, compatibilité Next.js/Vercel, sauvegarde, réversibilité et coûts du traitement/OCR.
Aucun projet cloud, abonnement, service payant ou migration de données ne doit être créé avant validation explicite du fournisseur et de ses éventuels coûts.

## 12. État
Cette version est une spécification technique, pas une bibliothèque persistante en production. La prochaine étape est le choix documenté des fournisseurs, puis le Lot A avec tests de sécurité avant tout import réel.