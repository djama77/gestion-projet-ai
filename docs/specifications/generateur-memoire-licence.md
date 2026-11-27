# Module « Mémoire Licence Gestion de Projet »

## Objectif
Accompagner un étudiant de Licence 1 à Licence 3 dans la préparation progressive d'un mémoire de gestion de projet, en prenant comme référence de structure le mini-mémoire transmis (49 pages), consacré à un projet de valorisation du tourisme à Djibouti. Le document sert de modèle de structure et de niveau de détail, jamais de source de données à recopier.

## Référence méthodologique observée dans le modèle
Le modèle comprend les pages préliminaires (page de garde, remerciements, avant-propos, résumé/abstract, sigles, listes et sommaire), puis :
1. Introduction générale et formulation de la problématique.
2. Diagnostic stratégique : contexte, analyse des besoins, SWOT, objectifs stratégiques, cadre logique et risques.
3. Planification : gouvernance et parties prenantes, triangle coût-délai-qualité, WBS et livrables, calendrier/phasage, budget et plan de financement.
4. Mise en œuvre, suivi-évaluation, gestion des risques, conformité et pérennisation.
5. Analyse des retombées, perspectives et apprentissage.
6. Contribution pratique, innovations et recommandations.
7. Conclusion générale, bibliographie et annexes (WBS, plan de travail, budget, organigramme, indicateurs, fiches, Gantt, cadre logique).

## Parcours fonctionnel livré dans cette première version
- Route applicative : `/memoire`.
- Trois modes : construire le plan complet, rédiger une partie, relire/améliorer un texte.
- Formulaire de cadrage : niveau Licence, thème, territoire, secteur, problème, objectif, durée et budget facultatif.
- Génération IA côté serveur via `/api/memoire/generate`.
- Les réponses sont des brouillons modifiables/copiables, jamais un mémoire certifié ou déposé automatiquement.
- Le niveau Licence 1/2/3 est transmis au moteur pour adapter le degré de détail.

## Règles d'intégrité académique et de qualité
- Ne pas copier le texte du mémoire du camarade, son sujet touristique, ses données, ses budgets, ses chiffres ou ses références.
- Ne pas fabriquer des enquêtes, entretiens, statistiques observées, sources, citations, résultats, partenaires ou financements.
- Marquer les informations manquantes par `[DONNÉE À COLLECTER]`.
- Toute donnée synthétique doit être étiquetée « SIMULÉE — exercice pédagogique » et ne peut pas être présentée comme une observation de terrain.
- Séparer diagnostic factuel, hypothèses de conception, activités planifiées, résultats attendus et résultats réellement mesurés.
- Contrôler la cohérence entre problématique, objectifs, résultats, activités, indicateurs, responsabilités, calendrier et budget.
- Expliquer les outils utilisés et les formules de calcul.
- Les sources et références doivent être vérifiées par l'étudiant avant dépôt.
- L'encadreur conserve le dernier mot sur le plan, la méthode et la version finale.

## Prochaines évolutions recommandées
- Export Word DOCX avec page de garde, styles de titres, table des matières et tableaux.
- Assistant de collecte des données et registre de sources bibliographiques vérifiables.
- Génération contrôlée des annexes (WBS, Gantt, budget, RACI, cadre logique, registre des risques, plan S&E).
- Sauvegarde/versionnage des chapitres par mémoire et espace de suivi encadreur.
- Import du guide méthodologique officiel de l'établissement pour adapter le modèle aux consignes réelles.

## Limites de cette version
- La génération dépend de `OPENAI_API_KEY` et du modèle configuré côté serveur.
- Les textes ne sont pas sauvegardés automatiquement dans une base de données.
- Aucun export DOCX ni contrôle de plagiat n'est implémenté dans cette première version.
- Le document modèle n'est pas embarqué comme corpus d'entraînement ; sa structure a été traduite en consignes applicatives.


## Bibliothèque comparative de références
Le générateur s'appuie désormais sur une bibliothèque de fiches méthodologiques décrivant quatre références :
- le mini-mémoire du collègue comme modèle principal de structuration d'un projet ;
- un mémoire Licence 3 consacré au suivi et contrôle qualité de travaux publics ;
- un mémoire universitaire consacré aux indicateurs et tableaux de bord de performance ;
- un mémoire universitaire consacré aux méthodes d'évaluation sur le cycle de vie du projet.

Voir `docs/references/bibliotheque-memoires-gestion-projet.md`. Les trois références externes sont des fiches de lecture synthétiques, pas des textes intégraux embarqués. Leurs métadonnées bibliographiques doivent être vérifiées avant citation.

Le prompt de génération oriente maintenant le choix des outils selon la nature du sujet : contrôle qualité pour les infrastructures, KPI/tableau de bord pour les projets pilotés par indicateurs, et évaluation ex ante/intermédiaire/finale selon le cycle de vie. Il interdit les affirmations causales d'impact non démontrées. Le sélecteur de chapitre propose également ces trois axes complémentaires.
