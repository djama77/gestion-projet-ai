# Roadmap produit — Gestion-Projet-AI

**Vision :** une plateforme universitaire de niveau Licence qui apprend à comprendre la gestion de projet et permet de mettre en pratique les méthodes sur des projets réels ou des cas pédagogiques.

**État initial vérifié le 27 novembre 2026 :** dépôt Next.js avec prototype de chat et extraction PDF par session ; ZIP Claude Code avec application Streamlit, moteur Python, modules pédagogiques et tests. Les fonctionnalités énumérées ci-dessous sont des objectifs tant qu'elles ne sont pas validées par du code et des tests exécutés.

## 1. Public et parcours

### Étudiant
1. choisit son niveau (L1, L2 ou L3), son UE et son chapitre ;
2. consulte le cours et ses notions ;
3. demande une explication adaptée à son niveau ;
4. réalise des exercices, quiz et études de cas ;
5. prépare ses devoirs et TP avec une méthode explicitée ;
6. consulte les lacunes identifiées à partir de ses propres résultats ;
7. exporte ses fiches et travaux.

### Formateur / enseignant
1. importe les supports et leurs versions ;
2. contrôle le classement et la qualité d'extraction ;
3. publie les documents aux apprenants autorisés ;
4. prépare ou révise des exercices ;
5. consulte les résultats agrégés autorisés ;
6. distingue les corrections officielles des propositions générées.

### Administrateur
- gère les utilisateurs et rôles ;
- contrôle les accès et les journaux ;
- gère les matières, niveaux et publications ;
- surveille la qualité des imports et les erreurs ;
- supervise les sauvegardes et paramètres.

## 2. Modules fonctionnels cibles

| Module | Fonctions principales | Priorité |
|---|---|---|
| Authentification et profils | compte, session, rôles, accès par ressource | P0 |
| Bibliothèque de cours | originaux privés, versions, métadonnées, statuts | P0 |
| Ingestion documentaire | PDF, DOCX, PPTX, extraction, OCR à part | P0 |
| Recherche documentaire | BM25/plein texte, pages, sections, filtres d'accès | P0 |
| Tuteur IA | explication, synthèse, oral, comparaison et sources | P1 |
| Fiches de révision | notions, exemples, erreurs, auto-test | P1 |
| Quiz | QCM, correction, explication, historique | P1 |
| Devoirs | analyse du sujet, brouillon, correction indicative | P1 |
| Travaux pratiques | dossier à compléter, étapes, grille, correction séparée | P1 |
| Progression | acquis et difficultés par UE/chapitre/compétence | P2 |
| Atelier projet | cadrage, parties prenantes, RACI, WBS, Gantt | P2 |
| Pilotage de projet | budget, risques, indicateurs, reporting, clôture | P2 |
| Exports | DOCX en premier, PDF ensuite, traçabilité | P2 |
| MCP lecture seule | catalogue, recherche, passages et métadonnées autorisés | P3 |
| Mode local / hors ligne | moteur local, synchronisation contrôlée | P3 |

## 3. Priorités de livraison

### P0 — rendre les documents fiables et privés
- authentification et contrôle d'accès serveur ;
- choix et validation de la base et du stockage ;
- bibliothèque persistante et versions ;
- extraction avec conservation des pages et des statuts ;
- indexation et recherche contrôlée ;
- tests d'isolation et de provenance.

**Définition de terminé :** un utilisateur importe un PDF autorisé, le retrouve après reconnexion, recherche un sujet et obtient les pages réellement retrouvées ; un second utilisateur ne peut pas accéder à ce document.

### P1 — enseigner efficacement
- tuteur par niveau et mode pédagogique ;
- fiches de cours ;
- quiz issus des sources ;
- devoirs et TP avec corrigé indicatif séparé ;
- export DOCX.

**Définition de terminé :** les réponses citent des sources exactes, signalent les lacunes du corpus, expliquent le raisonnement et n'inventent aucun corrigé officiel.

### P2 — passer de la théorie à la pratique
- atelier de cadrage et objectifs SMART ;
- parties prenantes et matrice RACI ;
- WBS et diagramme de Gantt ;
- dépendances, jalons, chemin critique si calcul fiable ;
- budget initial, engagé, réalisé et reste à faire ;
- registre des risques avec probabilité, impact, réponse et responsable ;
- indicateurs, tableau de bord et rapport de clôture.

**Définition de terminé :** les calculs, dates, totaux et états sont vérifiés sur jeux de données connus ; chaque indicateur a une définition, une formule, une fréquence, une source et un responsable.

### P3 — avancé
- connecteur MCP en lecture seule et authentifié ;
- mode local optionnel ;
- synchronisation avec gestion des conflits ;
- extensions et intégrations après tests et validation des coûts.

## 4. Atelier pratique : modèle minimum

Un projet doit comporter :
- identité, contexte, justification et porteur ;
- objectif général et objectifs spécifiques SMART ;
- bénéficiaires et parties prenantes ;
- résultats attendus, activités et livrables ;
- calendrier, jalons, responsables et dépendances ;
- budget prévisionnel, sources de financement et suivi financier ;
- risques, hypothèses et mesures de mitigation ;
- indicateurs de réalisation, résultats et effets ;
- mécanisme de suivi, fréquence, source et responsable ;
- compte rendu, leçons apprises et clôture.

Le système doit distinguer données saisies, calculs, hypothèses, prévisions et valeurs réellement observées. Les tableaux de bord n'affichent pas de valeurs fictives comme des réalisations.

## 5. Règles pédagogiques et de qualité

- Les supports officiels fournis sont la référence prioritaire.
- La provenance est attachée à chaque passage, réponse, quiz et fiche.
- Les apports généraux sont identifiés comme compléments extérieurs.
- « Corrigé officiel », « corrigé du document source » et « proposition IA » sont trois statuts différents.
- Un travail généré est une base d'apprentissage et non une preuve de travail personnel.
- Un résultat, une enquête ou une observation de terrain ne sont jamais inventés.
- Les notions non documentées sont nommées explicitement.
- Les exercices et retours doivent être adaptés au niveau L1, L2 ou L3, sans attribuer un niveau sans source ou choix de l'utilisateur.

## 6. Indicateurs de produit

Les indicateurs doivent être calculés à partir d'événements réels.

| Indicateur | Définition à implémenter |
|---|---|
| Documents disponibles | versions à statut available et contrôles validés |
| Taux d'extraction complète | imports complets / imports traités |
| Taux de passages avec provenance | passages indexés avec version et page/section connue / passages indexés |
| Réponses sourcées | réponses avec références existantes / réponses documentaires |
| Questions sans résultat | recherches sans passage pertinent / recherches totales |
| Réussite aux quiz | réponses correctes / réponses évaluées |
| Progression par compétence | évolution des résultats par compétence et période |
| TP réalisés | TP remis ou marqués comme terminés / TP commencés |
| Disponibilité du service | périodes disponibles / périodes mesurées |

Ne pas présenter un taux tant que la définition, le numérateur, le dénominateur, la période et la source ne sont pas déterminés.

## 7. Risques à piloter

| Risque | Contrôle |
|---|---|
| Fuite de documents | authentification, autorisation côté serveur, tests d'accès croisés |
| Hallucination du tuteur | recherche, provenance, abstention et tests |
| Mauvaise extraction | statut partiel, contrôle page par page, OCR distinct |
| Confusion des versions | SHA-256, historique et archivage |
| Coût IA ou cloud | plafonds, mesure, choix explicite du fournisseur |
| Dépendance fournisseur | formats ouverts, export et possibilité de migration |
| Perte de progression | base durable, sauvegarde et restauration testée |
| Mauvais calculs de gestion | fonctions déterministes et tests de référence |
| Usage abusif des devoirs | pédagogie explicative et transparence du statut indicatif |

## 8. Règles de livraison GitHub

- une branche courte par lot cohérent ;
- aucune modification directe de `main` ;
- PR décrivant périmètre, exclusions, tests, risques et captures utiles ;
- pas de fusion automatique ;
- ne pas introduire de service payant ou de stockage cloud sans décision validée ;
- mettre à jour le README uniquement après vérification de la fonctionnalité ;
- « terminé » signifie code, tests exécutés, documentation, revue et fusion explicite.

## 9. Prochaine séquence

1. Vérifier les dépendances, la CI, les scripts de test et les contraintes de déploiement.
2. Choisir la cible de stockage et la base après comparaison coût/confidentialité/réversibilité.
3. Construire P0 avec migrations et tests d'accès.
4. Adapter le moteur Python au service et non à Streamlit.
5. Intégrer le tuteur et la recherche.
6. Ajouter quiz, devoirs, TP et progression.
7. Construire l'atelier pratique de gestion de projet.
8. Déployer progressivement après validation des tests et sauvegardes.
