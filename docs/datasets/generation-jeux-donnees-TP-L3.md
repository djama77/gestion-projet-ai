# Génération de jeux de données — TP Licence 3

## Finalité
Permettre à Gestion-Projet-AI de fabriquer des jeux de données cohérents avec les dix TP de Management, Leadership et Gestion des compétences. Les données servent à apprendre à analyser, calculer, comparer, planifier et argumenter. Elles ne doivent jamais être présentées comme des observations réelles.

## Règles communes
- Chaque export porte le statut « SIMULÉES — usage pédagogique uniquement ».
- Chaque jeu de données comporte un identifiant de TP, un titre, le niveau Licence 3, les variables, les unités, la graine aléatoire et les observations.
- Les valeurs doivent être reproductibles avec une graine donnée.
- L'étudiant choisit le volume (petit jeu pour une démonstration, moyen pour un TP, grand pour un exercice avancé).
- Formats attendus : CSV pour Excel/Power BI et JSON pour l'application.
- Le générateur ne crée pas de personnes identifiables : identifiants fictifs A01, C01, etc.
- Toute valeur calculée doit pouvoir être recalculée à partir des variables sources.
- L'interface doit proposer un dictionnaire des variables, les hypothèses, les limites et une prévisualisation avant téléchargement.

## Correspondance des 10 TP

| TP | Thème | Variables principales | Analyses possibles |
|---|---|---|---|
| 1 | Décision et arbitrage | options, budget, bénéficiaires, impact, faisabilité, urgence | matrice multicritère, pondérations, classement |
| 2 | Motivation et performance | reconnaissance, autonomie, charge, motivation, performance | moyennes, corrélations exploratoires, diagnostic |
| 3 | Conduite du changement | services, effectifs, adhésion, résistance, formation | cartographie des parties prenantes, plan de conduite |
| 4 | Audit éthique | risques, probabilité, gravité, prévention | matrice des risques, priorisation |
| 5 | Feedback 360° | évaluateurs, catégories, notes par compétence | moyennes, écarts de perception, axes de progrès |
| 6 | Plan de formation | compétences, niveaux actuels/cibles, coûts, formations | écarts, budget, calendrier, indicateurs |
| 7 | GPEC | métiers, effectifs actuels, besoins futurs | projections, écarts, mobilité/recrutement |
| 8 | Recrutement responsable par IA | critères, notes, pondérations, score, revue humaine | score pondéré, biais, contrôle humain |
| 9 | Capitalisation des connaissances | service, type de savoir, fiche, validation | inventaire, priorisation, plan de capitalisation |
| 10 | Synthèse management/projet | lots, tâches, responsables, durées, budget, risques, indicateurs | WBS, Gantt, RACI, budget, risques, tableau de bord |

## Fonctionnement attendu dans l'application
1. L'étudiant sélectionne le TP et le niveau Licence 3.
2. Il choisit le type de cas (administration, association, PME, projet territorial) et la taille du jeu de données.
3. Le générateur affiche les variables, les valeurs simulées et les hypothèses.
4. L'étudiant peut demander un jeu facile, intermédiaire ou avancé, sans changer les notions évaluées.
5. Le système vérifie les valeurs, les totaux, les échelles, les valeurs manquantes et les relations logiques.
6. L'étudiant exporte en CSV/JSON et peut travailler avec Excel, Power Query ou Power BI.
7. Le tuteur IA propose ensuite des questions d'analyse adaptées au jeu généré.

## Règles propres à chaque TP
- TP1 : les critères doivent être notés sur une échelle commune et les pondérations totaliser 100 %.
- TP2 : notes bornées entre 1 et 5 ; les réponses restent anonymes et synthétiques.
- TP3 : effectifs entiers positifs ; adhésion et résistance sur 1 à 5.
- TP4 : probabilité et gravité sur 1 à 5 ; le niveau de risque est calculé par probabilité × gravité.
- TP5 : distinguer autoévaluation, supérieur, pairs et collaborateurs ; ne pas révéler l'identité des évaluateurs.
- TP6 : niveau actuel inférieur ou égal au niveau cible ; coûts positifs ; total du budget vérifié.
- TP7 : écart = besoin futur − effectif actuel ; distinguer besoins bruts et besoins couverts par formation/mobilité.
- TP8 : pondérations explicites totalisant 100 % ; score reproductible ; aucune décision finale automatisée ; contrôle des biais et revue humaine.
- TP9 : distinguer connaissances explicites et tacites ; statut de validation visible.
- TP10 : cohérence entre tâches, durées, responsables, budget, risques, jalons et indicateurs.

## Qualité et traçabilité des corrigés
Le corrigé doit reprendre les consignes du TP, traiter chaque question dans l'ordre, montrer les formules et les calculs, expliquer l'interprétation, proposer une conclusion et signaler les limites. Il doit être étiqueté « corrigé pédagogique indicatif généré par IA » tant qu'une correction officielle n'a pas été fournie par l'enseignant. Les réponses doivent distinguer les données du sujet, les données simulées, les hypothèses et les compléments de connaissances.

## Script disponible
Lancer depuis la racine du dépôt :
`node scripts/generate-tp-datasets.mjs`
- `--tp 1` : générer un seul TP.
- `--rows 100` : choisir le nombre de lignes (répète les profils de départ si nécessaire).
- `--seed 2026` : rendre la génération reproductible.
Les fichiers sont créés dans `data/datasets/licence3/` au format CSV et JSON.
