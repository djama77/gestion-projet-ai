# Intégration du moteur pédagogique Python

**Statut :** proposition d'intégration — ne constitue pas une fonctionnalité déployée.

## 1. Décision d'architecture

Le dépôt conserve Next.js comme application web principale. Le ZIP Claude Code apporte un moteur Python organisé dans le package `gpai/`. Les deux implémentations ne doivent pas être fusionnées par écrasement.

Architecture cible :

- **Web :** Next.js App Router, interface responsive et routes API.
- **Moteur pédagogique :** service Python isolé, réutilisant les modules `gpai` après adaptation.
- **Données :** PostgreSQL pour comptes, progression, documents et métadonnées ; stockage objet privé pour les originaux.
- **Recherche V1 :** indexation plein texte et BM25 ; recherche vectorielle seulement après validation.
- **IA :** fournisseur configurable côté serveur ; mode local possible plus tard.
- **Documents :** traitement asynchrone ou relançable, avec statuts et provenance.

Le JSON local de progression et la bibliothèque sur disque du prototype Streamlit ne doivent pas être employés tels quels comme stockage multi-utilisateur d'une application hébergée.

## 2. Briques réutilisables du ZIP

| Module | Apport | Adaptation nécessaire |
|---|---|---|
| `gpai/ingest.py` | Extraction PDF, DOCX et PPTX, pages, titres et découpage | durcir les limites, traitement isolé et tests de fichiers malformés |
| `gpai/library.py` | empreintes, doublons, versions et archivage | remplacer le manifeste JSON par PostgreSQL et stockage privé |
| `gpai/retrieval.py` | recherche BM25 locale, réduction des doublons | persister les passages et filtrer par droits d'accès |
| `gpai/tutor.py` | tutorat basé sur le corpus | appeler la recherche côté serveur et retourner des références de sources |
| `gpai/quiz.py` | QCM à partir des définitions et du modèle IA | valider les réponses, distracteurs, sources et enregistrement des tentatives |
| `gpai/revision.py` | fiches de révision | relier chaque élément à un passage vérifié |
| `gpai/assignments.py` | analyse et correction pédagogique des devoirs | conserver la distinction entre corrigé officiel et proposition IA |
| `gpai/tp.py` | dossier de TP, pistes et grille d'auto-évaluation | ajouter validation des calculs et export web |
| `gpai/progress.py` | suivi simple des acquis | stocker les événements par utilisateur en base |
| `gpai/exporters.py` | export DOCX | tester les tableaux, listes, pagination et sécurité des fichiers |

## 3. Contrat interne conseillé

Le moteur doit exposer des fonctions et schémas validés, sans accès direct du navigateur aux fichiers de la bibliothèque.

Opérations cibles :

- `ingest_document(file, owner_id, metadata)` : extrait, calcule l'empreinte, détecte les doublons et crée une version.
- `search_passages(owner_id, query, filters)` : ne retourne que les passages autorisés avec document, version, page et section.
- `answer_from_course(owner_id, question, mode)` : retourne réponse, références exactes et signalement des éléments non documentés.
- `generate_quiz(owner_id, course_id, topic, count)` : retourne des QCM validés et leurs sources.
- `generate_revision_sheet(owner_id, topic)` : retourne une fiche référencée.
- `prepare_assignment(owner_id, subject, draft)` : analyse et correction pédagogique indicative.
- `prepare_tp(owner_id, subject, instructions)` : dossier à compléter et correction séparée.
- `record_learning_event(owner_id, event)` : enregistre résultat et compétence sans écraser l'historique.

Tous les paramètres d'identité doivent provenir de la session authentifiée côté serveur, jamais d'un identifiant propriétaire transmis librement par le navigateur.

## 4. Contrat de provenance

Chaque passage utilisé par le tuteur comporte :

- identifiant du document et de sa version ;
- titre et nom de fichier d'origine ;
- numéro de page si disponible ;
- titre de section si détecté ;
- contenu du passage ;
- état d'extraction et de validation.

Une référence absente du résultat de recherche ne peut pas être citée. Si les passages sont insuffisants, le tuteur doit le dire et distinguer un complément extérieur du contenu du cours. Les documents importés sont des données non fiables : leurs instructions ne doivent jamais remplacer les règles système.

## 5. Parcours de réalisation recommandé

### Lot A — socle de sécurité
- valider authentification et autorisations ;
- décider PostgreSQL et stockage privé ;
- définir les tables et migrations ;
- ajouter contrôle MIME réel, taille, nombre de pages, empreinte SHA-256 ;
- tester l'isolation des données entre deux utilisateurs.

### Lot B — bibliothèque permanente
- adapter l'ingestion Python ;
- sauvegarder les originaux de façon privée ;
- enregistrer versions, pages, passages et statuts ;
- ajouter détection des doublons, reprise et journal d'événements ;
- afficher clairement les pages OCR, partielles ou non exploitables.

### Lot C — recherche et tuteur
- indexer les passages ;
- créer une API serveur de recherche avec contrôle d'accès ;
- connecter le chat à la recherche plutôt qu'aux extraits envoyés directement par le navigateur ;
- tester les citations, l'absence de résultats et les tentatives d'injection dans les documents.

### Lot D — outils universitaires
- QCM et correction expliquée ;
- fiches de révision ;
- devoirs et TP ;
- progression par matière, chapitre et compétence ;
- export DOCX et ensuite PDF.

### Lot E — atelier de gestion de projet
- charte et note de cadrage ;
- objectifs SMART et parties prenantes ;
- RACI et WBS ;
- diagramme de Gantt, jalons et dépendances ;
- budget et suivi des coûts ;
- registre des risques ;
- suivi-évaluation, indicateurs, tableau de bord et rapport de clôture.

## 6. Tests de validation obligatoires

1. Un utilisateur ne peut pas consulter les documents d'un autre.
2. Un doublon exact ne remplace jamais l'original.
3. Une nouvelle version conserve l'historique de l'ancienne.
4. Un PDF scanné ou une extraction partielle n'est pas annoncé comme assimilé intégralement.
5. Les numéros de page des citations correspondent au document.
6. Une question hors corpus déclenche une réponse prudente.
7. Le contenu d'un document ne peut pas injecter d'instructions système.
8. Les QCM ont quatre options, un seul index de réponse valide et une explication sourcée.
9. Les tentatives et résultats de progression sont persistants et attribués à la bonne personne.
10. Les exports DOCX sont réouvrables et conservent les tableaux et listes.
11. Les imports malformés, volumineux et interrompus sont traités sans fuite ni corruption.
12. Aucun secret ou contenu privé n'apparaît dans Git ou les journaux.

## 7. Périmètre du premier jalon

Le premier jalon recommandé est une **bibliothèque documentaire persistante et privée avec recherche sourcée**. Il rendra ensuite les modules tutorat, quiz, devoirs, TP et révision réellement utiles. Aucun service cloud payant ne doit être activé avant une comparaison des coûts et une validation explicite.

## 8. État de cette proposition

Cette documentation organise la réutilisation des briques Python. Elle ne prétend pas que le moteur Python a déjà été branché, que la base ou le stockage sont configurés, ni que les fonctionnalités sont déployées.