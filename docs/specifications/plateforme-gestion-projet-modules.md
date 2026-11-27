# Plateforme Gestion-Projet-AI — périmètre fonctionnel cible

## 1. Vision
Faire évoluer le dépôt pédagogique vers une plateforme universitaire d'apprentissage et de mise en pratique de la gestion de projet. Le corpus GitHub constitue la référence documentaire versionnée. Les fonctions applicatives ne sont déclarées opérationnelles qu'après implémentation et tests.

## 2. Espaces fonctionnels

### A. Académie et cours
- Catalogue des cours, matières, niveaux et chapitres réellement présents.
- Lecture structurée des cours, objectifs pédagogiques, notions, exemples et synthèses.
- Progression par chapitre : à découvrir, en cours, maîtrisé, à réviser.
- Fiches de révision, glossaire et cartes de notions.
- Liens explicites entre compétences, chapitres, exercices et évaluations.

### B. Tuteur IA documentaire
- Expliquer une notion en langage simple, puis proposer un approfondissement universitaire.
- Répondre à partir des passages retrouvés dans le corpus et citer le document, la version, la section et la page vérifiée.
- Séparer clairement extrait du cours, explication de l'IA et complément externe.
- Signaler les lacunes du corpus au lieu d'inventer une réponse.
- Conserver le contexte du cours sélectionné et permettre de changer de chapitre.

### C. Devoirs et évaluations
- Importer un sujet PDF, DOCX ou image selon les formats effectivement pris en charge.
- Identifier les consignes et les questions sans modifier le sujet original.
- Produire une correction détaillée : compréhension, méthode, raisonnement, réponse et justification.
- Distinguer corrigé officiel, réponse présente dans le support et corrigé IA indicatif.
- Proposer une rédaction universitaire naturelle et personnalisable, sans masquer l'origine des idées ni fabriquer des références.
- Générer une grille d'autoévaluation et des exercices de remédiation.

### D. Travaux pratiques (TP)
- Préparer un TP à partir des objectifs et notions du cours.
- Structurer : contexte, objectifs, prérequis, consignes, démarche, livrables et critères d'évaluation.
- Fournir un modèle de rapport modifiable.
- Séparer le sujet du TP, l'aide méthodologique et le corrigé indicatif.
- Ne pas inventer de données de terrain ou de résultats expérimentaux.

### E. Atelier de gestion de projet
Les outils suivants doivent être utilisables sur des cas d'étude pédagogiques :
- Charte et note de cadrage du projet.
- Analyse des parties prenantes et matrice RACI.
- Objectifs SMART et cadre logique.
- Découpage du travail (WBS), activités, jalons et diagramme de Gantt.
- Estimation des coûts, budget prévisionnel et suivi des dépenses.
- Registre des risques : probabilité, impact, réponse, responsable et statut.
- Plan de communication et compte rendu de réunion.
- Suivi des indicateurs, résultats, livrables et écarts.
- Tableau de bord synthétique et rapport périodique.
- Capitalisation des leçons apprises et clôture du projet.

Ces outils sont des modules cibles. Les calculs, formules et indicateurs devront être vérifiés par des tests avant toute utilisation dans un contexte réel.

### F. Révision et suivi des compétences
- Évaluation diagnostique par compétence.
- Exercices progressifs et quiz formatifs.
- Historique des tentatives et feedback explicatif.
- Révisions espacées configurables.
- Tableau de progression individuel.
- Recommandations de remédiation justifiées par les résultats observés.

## 3. Principes pédagogiques
- Partir du cours sélectionné et des sources disponibles.
- Adapter le niveau de détail à la demande : découverte, explication, approfondissement ou application.
- Décomposer les raisonnements et expliciter les méthodes.
- Utiliser des exemples de gestion de projet, notamment des cas contextualisés lorsque les sources le permettent.
- Distinguer apprentissage, entraînement et évaluation.
- Ne jamais qualifier un corrigé d'officiel sans preuve explicite.

## 4. Architecture logique cible
1. Interface web responsive.
2. Authentification et gestion des espaces autorisés.
3. Catalogue des documents et versions.
4. Stockage privé des originaux.
5. Extraction PDF/DOCX et OCR optionnel.
6. Index plein texte avec références de pages et sections.
7. Service de recherche documentaire.
8. Orchestrateur pédagogique et outils de gestion de projet.
9. Connecteur MCP en lecture seule pour les assistants externes.
10. Journalisation, contrôle d'accès, sauvegarde et observabilité.

Le choix des fournisseurs et les coûts doivent être évalués avant toute création de service ou migration. Le corpus GitHub et la bibliothèque privée ne doivent pas être confondus : les supports publics autorisés peuvent être versionnés dans Git ; les documents personnels ou confidentiels doivent rester dans un stockage privé.

## 5. Rôles envisagés
- Apprenant : consulter les cours, réaliser les exercices et suivre sa progression.
- Enseignant/tuteur : valider des ressources et consulter les travaux autorisés.
- Gestionnaire de contenu : contrôler les imports, métadonnées et versions.
- Administrateur : gérer les accès, paramètres et journaux.

Les permissions doivent être appliquées côté serveur, au niveau de chaque ressource.

## 6. Indicateurs de pilotage
- Nombre de documents reçus, validés et publiés.
- Taux de réussite des extractions et nombre de pages nécessitant OCR.
- Part des passages indexés avec provenance complète.
- Taux de réponses du tuteur accompagnées de sources vérifiables.
- Nombre de recherches sans résultat.
- Progression par compétence et par chapitre.
- Taux de réussite aux tests fonctionnels et de sécurité.
- Temps de traitement par document et coût éventuel des services externes.

Aucun indicateur ne doit être affiché comme mesuré tant qu'une collecte réelle et une méthode de calcul ne sont pas en place.

## 7. Hors périmètre tant que non validé
- Publication automatique d'un corrigé comme corrigé officiel.
- Partage public par défaut des documents importés.
- Écriture dans le dépôt GitHub par le connecteur MCP.
- Connexion universelle à tous les assistants IA.
- Déploiement d'un fournisseur payant sans validation.
- Présentation des modules spécifiés comme déjà disponibles.

## 8. Critère général de réussite
Un apprenant peut sélectionner un chapitre réellement publié, retrouver les passages sources, demander une explication, réaliser un devoir ou un TP, puis obtenir un retour pédagogique traçable. Un utilisateur peut également appliquer les méthodes apprises à un projet d'exemple au moyen d'outils de planification et de suivi vérifiés.
