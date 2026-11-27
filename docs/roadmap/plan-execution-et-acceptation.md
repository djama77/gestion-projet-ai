# Plan d'exécution et critères d'acceptation — Gestion-Projet-AI

## 1. Règle de pilotage
Le développement avance par lots courts. Chaque lot possède un périmètre, un responsable, des dépendances, des critères d'acceptation, des preuves de test et un statut. Une fonctionnalité spécifiée n'est pas considérée comme livrée tant que son code, ses tests et sa documentation ne sont pas vérifiés.

## 2. Ordre de réalisation

### Lot 0 — assainissement et décisions
- Examiner les branches et PR ouvertes, leurs bases et leurs dépendances.
- Définir une branche d'intégration claire et éviter les PR parallèles qui modifient les mêmes fichiers sans stratégie.
- Établir le registre des décisions : hébergement, base, stockage, authentification, coûts et confidentialité.
- Vérifier les licences et droits d'utilisation des supports.
**Sortie attendue :** état initial documenté, décisions ouvertes identifiées et plan de fusion explicite.

### Lot 1 — corpus documentaire fiable
- Définir le schéma de métadonnées et la structure de classement.
- Ajouter les supports originaux autorisés.
- Extraire le texte en conservant l'ordre, les pages, les titres et les tableaux.
- Signaler les PDF scannés, extractions partielles et documents incomplets.
- Construire le catalogue et vérifier chaque entrée.
**Sortie attendue :** documents traçables, statuts exacts et rapport d'ingestion.

### Lot 2 — bibliothèque durable et sécurisée
- Choisir puis valider le fournisseur de stockage et la base.
- Mettre en place authentification, autorisations et stockage privé.
- Implémenter versions, empreintes, dédoublonnage et historique.
- Tester l'isolation des utilisateurs avant d'importer des documents privés.
**Sortie attendue :** import persistant, versionnage et tests d'accès réussis.

### Lot 3 — recherche et tuteur documentaire
- Mettre en place l'indexation plein texte.
- Retourner des passages avec document, version, page/section et statut de validation.
- Connecter le tuteur à la recherche plutôt qu'à un transfert manuel limité de texte.
- Tester les réponses avec et sans résultat documentaire.
**Sortie attendue :** réponses vérifiables et abstention correcte en cas de source insuffisante.

### Lot 4 — devoirs et TP
- Analyser les sujets et conserver le fichier original.
- Générer des corrections détaillées et pédagogiques.
- Produire des modèles de TP et rapports modifiables.
- Séparer correction officielle, réponse issue du cours et proposition IA.
- Ajouter export DOCX/PDF après validation de la fidélité.
**Sortie attendue :** devoir et TP reproductibles, éditables et référencés.

### Lot 5 — atelier de gestion de projet
- Construire les modules cadrage, parties prenantes, RACI et WBS.
- Ajouter planning, jalons et suivi des tâches.
- Ajouter budget, risques, indicateurs, reporting et clôture.
- Tester les formules, totaux, dates, dépendances et exports sur jeux de données connus.
**Sortie attendue :** outils de gestion cohérents, calculs testés et limites documentées.

### Lot 6 — révision et progression
- Définir les compétences et objectifs par cours.
- Enregistrer les tentatives et retours pédagogiques.
- Proposer révisions et remédiations explicables.
- Tester la cohérence des tableaux de bord.
**Sortie attendue :** progression fondée sur des événements réels, non sur des estimations inventées.

### Lot 7 — connecteur MCP et intégrations
- Implémenter d'abord un serveur MCP en lecture seule.
- Exposer catalogue, recherche, passages et métadonnées.
- Authentifier les accès distants et limiter le débit.
- Tester chaque client séparément et documenter les compatibilités confirmées.
**Sortie attendue :** prototype MCP testé, avec provenance et accès limités.

## 3. Priorisation
- P0 : intégrité du corpus, confidentialité, droits d'accès, provenance et sauvegarde.
- P1 : import durable, extraction, indexation et recherche.
- P2 : tuteur, devoirs, TP et exports.
- P3 : atelier de gestion de projet et tableaux de bord.
- P4 : révision avancée, MCP distant et intégrations supplémentaires.

Une priorité ne dispense jamais des tests de sécurité et de non-régression.

## 4. Modèle de suivi des tâches
Chaque tâche GitHub doit comporter :
- identifiant et titre orienté résultat ;
- problème utilisateur traité ;
- périmètre inclus et exclusions ;
- priorité P0 à P4 ;
- dépendances ;
- critères d'acceptation vérifiables ;
- tests attendus ;
- risques et décisions en attente ;
- statut : backlog, ready, in_progress, review, blocked ou done.

Définition de « done » :
1. code ou document livré dans une branche ;
2. tests pertinents exécutés et réussis ;
3. contrôles de sécurité et de non-régression effectués selon le risque ;
4. documentation mise à jour ;
5. revue réalisée ;
6. PR fusionnée explicitement ;
7. état réel reflété dans le README et la feuille de route.

## 5. Tests transversaux obligatoires
- Import d'un document valide, vide, trop volumineux et malformé.
- Détection de doublons et conservation des versions.
- PDF texte, PDF scanné et extraction partielle.
- Correspondance des pages citées avec le fichier source.
- Recherche sans résultat et recherche ambiguë.
- Refus d'accès à un document d'un autre utilisateur.
- Tentative d'injection d'instructions dans un document importé.
- Vérification qu'un corrigé indicatif n'est pas présenté comme officiel.
- Calculs de budget, pourcentages, dates, durées et indicateurs sur jeux de tests connus.
- Export et réouverture des fichiers DOCX/PDF.
- Reprise après erreur de traitement sans doublons.
- Vérification qu'aucun secret n'est commité ou journalisé.

## 6. Gestion des risques du projet
| Risque | Effet | Mesure |
|---|---|---|
| Supports sources absents ou incomplets | Réponses non vérifiables | Inventaire et statut explicite |
| OCR imprécis | Erreurs de contenu | Relecture des pages incertaines |
| Fuite de documents privés | Atteinte à la confidentialité | Accès serveur, tests d'isolation |
| Coût fournisseur imprévu | Dépassement de budget | Comparatif et validation préalable |
| PR concurrentes | Conflits et régressions | Base de branche claire et revue |
| Hallucination de l'IA | Mauvais apprentissage | Provenance, abstention et tests |
| Formules de pilotage erronées | Décisions faussées | Jeux de tests et validation métier |

## 7. Tableau de bord de projet — champs à mesurer
- Avancement par lot : tâches done / tâches planifiées.
- Tâches bloquées et ancienneté du blocage.
- PR ouvertes, en revue et fusionnées.
- Tests réussis / échoués / non exécutés.
- Documents reçus / extraits / validés / publiés.
- Incidents de sécurité et défauts critiques ouverts.
- Décisions fournisseur et coûts en attente.

Les valeurs restent « non mesurées » tant que les données de suivi ne sont pas reliées à une source réelle.

## 8. Gouvernance GitHub
- Une branche par lot cohérent ou correction.
- PR courtes avec description, tests, risques et captures si interface.
- Pas de fusion automatique.
- Ne pas modifier main directement.
- Vérifier la branche de base de chaque PR avant toute fusion.
- En cas de branches dépendantes, documenter l'ordre de fusion et rebaser/retargeter proprement.
- Conserver les rapports de test utiles dans les artefacts CI.

## 9. État initial au 27 novembre 2026
- PR #2 : bibliothèque documentaire persistante, ouverte en brouillon.
- PR #3 : corpus évolutif et connecteur MCP, ouverte en brouillon et basée sur la branche de développement pédagogique.
- Les spécifications ne démontrent pas que le stockage persistant, l'index, le serveur MCP ou les modules applicatifs sont opérationnels.
- Les supports originaux doivent être inventoriés avant de déclarer les chapitres assimilés.

## 10. Prochaine étape recommandée
Consolider les décisions d'architecture et l'inventaire des sources, puis réaliser le Lot 1 sur un premier document réel. Ne pas commencer simultanément le stockage, l'OCR, les exports, les tableaux de bord et le serveur MCP avant d'avoir validé le pipeline documentaire de bout en bout.
