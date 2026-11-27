# Générateur pédagogique de TP — contrat de production

## Finalité

Permettre à un étudiant de Licence 3 Gestion de Projet de demander un TP par thème et d'obtenir un dossier complet, construit prioritairement à partir des cours effectivement importés.

## Corpus pédagogique de référence

Le support Word identifié le 27 novembre 2026 comprend deux cours :
- Management et Leadership : 9 chapitres.
- Gestion des compétences : 7 chapitres.

Le document est structuré avec des explications, des exemples, des exercices d'application, des QCM, des évaluations et des corrigés. Les thèmes des TP doivent être rattachés au chapitre pertinent. Si le thème demandé n'est pas explicitement traité dans le passage retrouvé, l'assistant doit le signaler et qualifier les outils ajoutés de compléments pédagogiques.

## Dossier attendu pour chaque TP

1. **Fiche pédagogique** : matière, chapitre, niveau, durée, objectifs et prérequis.
2. **Contexte** : organisation fictive, projet, situation-problème et acteurs.
3. **Énoncé étudiant** : présentation complète, consignes et annexes.
4. **Données** : tableau de données cohérent, dictionnaire des variables, unités, période, hypothèses de simulation et règles de calcul.
5. **Travail demandé** : questions numérotées, livrables attendus et barème.
6. **Corrigé intégral** : réponse à chaque question, méthode, formules, calculs intermédiaires, résultats, interprétation et recommandations.
7. **Évaluation** : grille critériée, compétences évaluées et erreurs fréquentes.

## Scénarios de TP à savoir produire

### Gestion des risques
- Identifier les risques d'un projet fictif.
- Estimer probabilité et impact selon une échelle explicitée.
- Calculer la criticité avec la formule annoncée.
- Classer les risques et construire une matrice.
- Proposer des réponses, désigner un responsable et fixer des indicateurs de suivi.
- Estimer le risque résiduel après traitement.
- Justifier les arbitrages.

### Gestion des compétences
- Définir les compétences nécessaires à une équipe projet.
- Construire un référentiel avec niveaux attendus.
- Exploiter une matrice des compétences observées.
- Calculer les écarts entre niveau requis et niveau détenu.
- Prioriser les besoins de développement.
- Construire un plan d'action (formation, tutorat, accompagnement, mobilité).
- Définir les indicateurs de suivi et mesurer les progrès.

Ces méthodes constituent des exemples d'application. L'assistant doit vérifier leur compatibilité avec le cours importé et identifier les compléments qu'il ajoute.

## Règles de simulation des données

- Toujours afficher « Données simulées à des fins pédagogiques ».
- Utiliser des noms d'organisations et de personnes fictifs.
- Décrire les hypothèses, la période, les unités et les valeurs manquantes éventuelles.
- Ne pas présenter les données comme issues d'une enquête ou d'une institution réelle.
- Vérifier les totaux, pourcentages, classements et calculs avant de présenter le corrigé.
- Fournir suffisamment de lignes pour réaliser réellement les analyses demandées.

## Règles de correction

- Reprendre exactement la numérotation des questions.
- Donner la formule avant le calcul.
- Montrer les étapes et unités.
- Interpréter le résultat dans le contexte du projet.
- Distinguer une réponse attendue, une variante acceptable et une recommandation.
- Ne jamais qualifier un corrigé généré d'officiel.
- Signaler explicitement les hypothèses ou informations qui ne figurent pas dans le cours.

## Exemples de demandes utilisateur

- « Prépare un TP de gestion des risques, niveau Licence 3, avec 12 risques, un tableau de données, 6 questions, un barème et un corrigé intégral. »
- « Crée un exercice de gestion des compétences avec une matrice de 8 collaborateurs et 10 compétences, puis corrige chaque question. »
- « Fais un TP à partir du chapitre 6 du cours Management et Leadership et indique les compléments qui ne figurent pas dans le support. »

## Limites techniques actuelles

L'interface sait extraire les textes de PDF et DOCX et les transmettre à l'IA pendant la session. Les documents ne sont pas encore archivés de façon persistante. L'extraction DOCX conserve le texte, mais ne garantit pas la restitution de la mise en page, des images ou des tableaux complexes. Le contexte transmis à l'IA est limité ; pour un TP sur un chapitre précis, il faut privilégier l'import du support et nommer le chapitre dans la demande.
