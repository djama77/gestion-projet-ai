# Assimilation continue des cours — règles du corpus

## Objectif

Faire du dépôt GitHub `gestion-projet-ai` le corpus de référence évolutif des cours, chapitres, exercices, travaux pratiques et corrigés transmis progressivement. Le corpus doit pouvoir être interrogé par plusieurs assistants IA au moyen d'un connecteur compatible MCP.

L'ajout de nouveaux chapitres ne doit pas nécessiter de reconstruire le système : chaque lot est versionné, contrôlé, indexé et ajouté au catalogue.

## Principe essentiel

Un document n'est considéré comme assimilé que lorsqu'il a été effectivement ajouté au dépôt, contrôlé, extrait et référencé dans le catalogue. Une mention dans le README, un plan de cours ou une conversation ne prouve pas qu'un support original est présent.

## Cycle d'intégration d'un nouveau lot

1. **Réception** : conserver le fichier original transmis (PDF, DOCX ou autre format accepté) sans le réécrire.
2. **Identification** : relever le titre exact, l'auteur/organisme s'il est indiqué, le niveau si le document le précise, la matière, le chapitre, la date et la version.
3. **Contrôle** : vérifier que le fichier est lisible, non vide et complet autant que possible. Signaler les pages scannées, tableaux illisibles, pages manquantes ou erreurs d'extraction.
4. **Extraction** : produire un texte exploitable en conservant les titres, l'ordre, les tableaux et les numéros de page d'origine lorsqu'ils sont disponibles.
5. **Comparaison** : comparer le texte extrait au document source sur les passages sensibles, les tableaux, les exercices et les corrigés.
6. **Classement** : ranger le document dans la structure par cours et chapitre. Ne pas inventer le niveau, la pagination ou le nom d'un enseignant.
7. **Indexation** : créer ou mettre à jour les métadonnées et les références des passages.
8. **Validation** : exécuter les contrôles automatisés et relire les résultats. Un lot en attente de vérification reste marqué comme tel.
9. **Publication** : proposer les changements sur une branche et une pull request. Ne pas fusionner automatiquement.
10. **Actualisation** : après fusion, le connecteur relit le corpus et rend le nouveau chapitre disponible aux assistants.

## Structure cible

```text
docs/
  cours/
    management-leadership/
      chapitre-01/
        source/
        texte/
        metadata.json
    gestion-competences/
      chapitre-01/
        source/
        texte/
        metadata.json
    autres-cours/
      <cours>/
        <chapitre>/
          source/
          texte/
          metadata.json
  evaluations/
    exercices/
    travaux-pratiques/
    corriges-officiels/
  catalogues/
    corpus.json
    index.json
```

Cette structure est une cible de classement. Elle ne signifie pas que les dossiers ou documents existent déjà.

## Métadonnées minimales par document

- `document_id` : identifiant stable.
- `title` : titre exact du document.
- `course` : cours auquel il se rattache.
- `chapter` : chapitre si explicitement identifié.
- `level` : niveau uniquement si attesté par la source, sinon `unknown`.
- `document_type` : cours, exercice, TP, corrigé, annexe ou autre.
- `source_filename` : nom du fichier original.
- `source_path` : chemin GitHub du fichier.
- `source_sha256` : empreinte du fichier original.
- `version` : version du document.
- `language` : langue détectée ou déclarée.
- `pages` : nombre de pages si vérifié.
- `ingestion_status` : received, extracted, needs_review, validated ou published.
- `verified_at` : date de vérification.
- `notes` : limites connues.

## Provenance obligatoire dans les réponses

Chaque passage exploité doit pouvoir retourner :
- le titre du support ;
- le nom du fichier ;
- le chemin GitHub ;
- le chapitre ou la section ;
- la page d'origine, seulement si elle a été vérifiée ;
- le statut de validation ;
- la nature du contenu.

Les catégories de provenance sont :
- `SOURCE_COURS` : contenu réellement présent dans le support ;
- `CORRIGE_OFFICIEL` : corrigé explicitement identifié comme officiel ;
- `REPONSE_ATTENDUE_SOURCE` : réponse présente dans le document source sans preuve qu'elle soit officielle ;
- `COMPLEMENT_PEDAGOGIQUE` : explication ou exemple ajouté ;
- `CORRIGE_IA_INDICATIF` : proposition générée par l'IA et non validée comme corrigé officiel.

## Contrôles bloquants

- Ne jamais déclarer assimilé un fichier absent du dépôt.
- Ne jamais fabriquer une page, une citation, un chapitre ou un corrigé officiel.
- Ne pas remplacer le document original par une version reformulée.
- Ne pas fusionner silencieusement deux versions différentes.
- Signaler les doublons, les fichiers incomplets et les extractions OCR incertaines.
- Si aucun passage fiable n'est trouvé, répondre que le corpus ne permet pas de confirmer la réponse.
- Les compléments issus des connaissances générales doivent être identifiés comme tels.

## Ajout futur d'un chapitre

Lorsqu'un nouveau chapitre est transmis, le traitement porte uniquement sur le nouveau lot et les liens affectés. Le catalogue et l'index sont ensuite reconstruits ou actualisés automatiquement. Les chapitres déjà validés restent inchangés, sauf demande explicite de correction ou nouvelle version source.

## Sécurité et droits

Le connecteur pédagogique doit être en lecture seule. Les assistants peuvent rechercher et lire les supports, mais ne doivent pas modifier le dépôt ni publier de commits. Les secrets et jetons d'accès ne doivent jamais être stockés dans les documents du corpus.
