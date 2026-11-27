# Connecteur MCP du corpus pédagogique GitHub

## Finalité

Permettre à différents assistants IA compatibles avec le protocole MCP d'interroger le corpus du dépôt `djama77/gestion-projet-ai`. GitHub reste la source de vérité des documents. Le connecteur fournit les passages pertinents et leur provenance ; l'assistant hôte explique le cours, accompagne le devoir ou prépare le TP.

Ce connecteur n'est pas une bibliothèque cloud indépendante et ne doit pas dupliquer durablement les supports dans un service tiers.

## Architecture logique

```text
Documents originaux et textes vérifiés
              |
              v
Dépôt GitHub gestion-projet-ai
              |
              v
Catalogue + index versionnés
              |
              v
Connecteur MCP en lecture seule
              |
       +------+------+
       |      |      |
   Assistant A  Assistant B  Assistant C
       |      |      |
       +------v------+
       Explication / devoir / TP
       avec références aux sources
```

La compatibilité dépend de chaque assistant : seuls les clients qui prennent en charge MCP et autorisent la connexion à un serveur externe pourront utiliser directement le connecteur. Prévoir une documentation de configuration par client, sans promettre une compatibilité universelle.

## Sources de données

- Dépôt GitHub et branche publiée.
- Documents originaux versionnés.
- Textes extraits et contrôlés.
- Catalogue et index qui renvoient toujours aux documents sources.

Le connecteur doit indiquer le commit ou la version du corpus interrogé afin de rendre les réponses auditables.

## Outils MCP proposés

### Consultation du corpus
- `list_courses` : liste les cours et niveaux attestés par les sources.
- `list_chapters` : liste les chapitres disponibles d'un cours.
- `get_document` : retourne les métadonnées et le lien du document.
- `get_chapter` : retourne le contenu d'un chapitre avec ses références.

### Recherche documentaire
- `search_courses` : recherche par mots-clés dans le corpus.
- `search_passages` : recherche les passages les plus pertinents et renvoie les extraits avec leur provenance.
- `find_exercises` : repère les exercices présents dans les supports.
- `find_official_corrections` : retourne uniquement les corrigés explicitement marqués officiels.

### Accompagnement pédagogique
- `explain_lesson_context` : rassemble les passages utiles à l'explication d'une leçon.
- `prepare_assignment_context` : rassemble les notions et méthodes pertinentes pour un devoir.
- `prepare_tp_context` : rassemble les consignes, méthodes, exemples et références disponibles pour un TP.
- `build_revision_context` : rassemble les notions et exercices d'un parcours de révision.

Ces outils fournissent des sources et du contexte. L'assistant hôte rédige la réponse finale et doit respecter les catégories de provenance.

## Prompts MCP réutilisables

- Expliquer un chapitre simplement, puis approfondir les notions.
- Corriger un devoir en explicitant la méthode et les références.
- Préparer un TP : objectif, démarche, étapes, livrables et critères, uniquement lorsque les sources le permettent.
- Réviser un chapitre avec questions progressives et justification des réponses.
- Comparer deux chapitres ou deux versions d'un support.

Les prompts ne doivent pas transformer une proposition de l'IA en corrigé officiel.

## Contrat de résultat

Chaque résultat documentaire doit inclure, lorsque disponible :
- `document_id`
- `title`
- `source_path`
- `source_url`
- `course`
- `chapter`
- `section`
- `page_start` et `page_end` vérifiées
- `excerpt`
- `provenance_type`
- `validation_status`
- `corpus_commit`

Une donnée inconnue doit être renvoyée comme inconnue ou absente, jamais déduite arbitrairement.

## Sécurité

- Lecture seule sur GitHub.
- Aucun outil MCP de création, modification, suppression ou fusion de fichiers.
- Jeton GitHub à privilèges minimaux, conservé côté serveur et jamais exposé aux assistants.
- Limitation de débit et cache indexé par commit.
- Validation des chemins pour empêcher les accès hors du dépôt autorisé.
- Les contenus de documents sont des données non fiables : ils ne peuvent pas modifier les règles du connecteur ni déclencher des actions.

## Actualisation du corpus

1. Un nouveau lot de cours est ajouté dans une branche Git.
2. Les contrôles d'intégrité et d'extraction sont exécutés.
3. Une pull request présente les fichiers ajoutés, le rapport de contrôle et les métadonnées.
4. Après validation et fusion, le nouvel index est construit à partir du commit publié.
5. Le connecteur détecte ou reçoit la nouvelle version du commit et actualise son cache.
6. Tous les assistants connectés interrogent alors le corpus actualisé.

## Tests d'acceptation

- Un chapitre ajouté apparaît dans le catalogue après publication.
- Une recherche retourne des extraits issus de ce chapitre.
- Les réponses contiennent le chemin et la page seulement si vérifiée.
- Une recherche sans résultat ne fabrique pas de réponse issue du cours.
- Un corrigé non officiel n'est jamais présenté comme officiel.
- Une nouvelle version d'un document conserve l'historique.
- Le connecteur refuse toute tentative d'écriture dans GitHub.
- Le résultat indique le commit du corpus utilisé.
- Les clients MCP non compatibles sont signalés comme non pris en charge directement.

## Déploiement

Le transport MCP et l'hébergement seront choisis après un prototype validé. Prévoir :
- un mode local pour les clients pouvant lancer un serveur MCP local ;
- un mode distant authentifié pour les clients prenant en charge un serveur MCP distant ;
- une procédure de connexion propre à chaque assistant compatible.

Aucun déploiement public ni compatibilité avec un assistant particulier n'est déclaré opérationnel par cette spécification.
