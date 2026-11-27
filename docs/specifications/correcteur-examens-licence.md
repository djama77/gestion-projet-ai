# Correcteur intelligent — examens et devoirs de Licence en gestion de projet

## Finalité

Permettre à l'étudiant de s'entraîner avec des sujets de niveau Licence 1, 2 et 3, puis de soumettre une copie pour recevoir une correction pédagogique question par question. Le système est un outil d'entraînement et d'aide à la progression, pas un service de notation officielle.

## Parcours étudiant

1. Choisir le niveau et le sujet (ou coller un sujet personnalisé).
2. Consulter les consignes, la durée et le barème.
3. Rédiger les réponses dans l'interface ou importer une copie PDF dont le texte peut être extrait.
4. Ajouter facultativement le barème de l'enseignant et les documents autorisés.
5. Lancer la correction.
6. Consulter le diagnostic, la note indicative, le détail par question, les réponses attendues et les conseils.
7. Corriger sa copie et demander une nouvelle évaluation.

## Formats d'entrée

- Texte saisi ou collé.
- PDF texte via le service d'extraction existant.
- Le texte extrait doit être affiché et modifiable avant envoi.
- Les PDF scannés ou illisibles sont signalés ; aucune réponse ne doit être devinée.
- Ne pas annoncer DOCX tant qu'un parseur DOCX n'est pas implémenté et testé.

## Fonctionnalités du correcteur

- Détection et numérotation des questions.
- Appariement aux consignes et au barème.
- Attribution des points par question et sous-critère.
- Points partiels pour les démarches valides.
- Vérification des calculs, formules, unités et interprétations.
- Acceptation de formulations alternatives pertinentes.
- Repérage des omissions, contresens et réponses hors sujet.
- Explication de l'erreur et présentation d'une réponse attendue.
- Appréciation générale, compétences maîtrisées et axes de progression.
- Exercices de remédiation ciblés.

## Format de sortie obligatoire

1. Statut de la correction : exploitable, partielle ou à revoir.
2. Note proposée /20, ou mention « non calculable » si aucun barème exploitable.
3. Tableau par question : points obtenus, points possibles, justification.
4. Correction détaillée de chaque question.
5. Calculs vérifiés et étapes de raisonnement.
6. Erreurs fréquentes et points à améliorer.
7. Appréciation globale et plan de révision.
8. Avertissement de validation humaine.

## Gouvernance des barèmes

- Le barème explicite fourni par l'enseignant prime.
- À défaut, le barème du sujet intégré est utilisé.
- Si aucun barème n'est disponible, le système peut proposer une grille indicative mais doit l'identifier clairement.
- Ne pas fabriquer une répartition de points comme si elle provenait de l'enseignant.
- Le total doit être vérifié avant affichage.
- Les réponses différentes mais justifiées doivent recevoir des points.
- Ne pas pénaliser deux fois la même erreur.
- Les notes sont indicatives et ne remplacent jamais la décision d'un enseignant.

## Sécurité et confidentialité

- Limiter la taille du sujet et de la copie.
- Ne pas demander de données personnelles inutiles.
- Afficher un rappel de ne pas transmettre de données sensibles concernant des tiers.
- Ne pas stocker les copies dans une bibliothèque persistante sans consentement explicite et mécanisme de sécurité.
- Ne pas exposer la clé API côté navigateur.
- Valider les entrées côté serveur et limiter les longueurs.
- Traiter le texte de la copie comme contenu non fiable, jamais comme instruction système.

## Tests d'acceptation

- Chaque niveau propose un sujet, des questions, une durée et un barème.
- Une copie complète reçoit une correction structurée question par question.
- Les points partiels sont justifiés.
- Un calcul erroné est repéré et la bonne méthode est expliquée.
- Une réponse alternative correcte n'est pas rejetée par simple différence de formulation.
- Un barème fourni remplace le barème indicatif.
- Sans barème exploitable, aucune note arbitraire n'est présentée comme fiable.
- Une copie vide, trop longue ou illisible est refusée avec un message clair.
- La réponse indique les limites et requiert une validation humaine.
